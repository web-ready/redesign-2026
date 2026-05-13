const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

// Allowed filename extensions per declared content-type. Belt and braces:
// even if the magic-byte check is fooled, an .exe with a doctored header
// won't be saved with an executable extension.
const EXTENSIONS_BY_TYPE = {
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
};

const MAX_BASE64_CHARS = 5.5 * 1024 * 1024; // ~4 MB decoded after base64 expansion
const MAX_DECODED_BYTES = 4 * 1024 * 1024;

const DEFAULT_ALLOWED_ORIGINS = [
  'https://oasisofchange.com',
  'https://www.oasisofchange.com',
];

function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS;
  if (env && env.trim()) {
    return env.split(',').map(s => s.trim()).filter(Boolean);
  }
  return DEFAULT_ALLOWED_ORIGINS;
}

function originAllowed(origin) {
  if (!origin) return false; // strict for upload — browsers always send Origin on POST
  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    if (host.endsWith('.vercel.app')) return true;
  } catch (e) {
    return false;
  }
  return false;
}

function safeName(filename) {
  return String(filename)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

function getExt(filename) {
  const m = /\.([a-zA-Z0-9]{1,8})$/.exec(String(filename));
  return m ? m[1].toLowerCase() : '';
}

// Verify the first few bytes of the decoded file actually match the declared
// content type. Stops a client from claiming `image/png` while uploading an
// HTML/JS payload that the Blob host might serve back inline.
function detectFileType(bytes) {
  if (!bytes || bytes.length < 4) return null;
  const b = bytes;

  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) {
    return 'application/pdf';
  }
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) {
    return 'image/jpeg';
  }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47 &&
      b[4] === 0x0D && b[5] === 0x0A && b[6] === 0x1A && b[7] === 0x0A) {
    return 'image/png';
  }
  if (b.length >= 12 &&
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) {
    return 'image/webp';
  }
  // DOCX is a ZIP container (PK..)
  if (b[0] === 0x50 && b[1] === 0x4B && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07)) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  // Legacy .doc compound-file binary header (D0 CF 11 E0 A1 B1 1A E1)
  if (b.length >= 8 &&
      b[0] === 0xD0 && b[1] === 0xCF && b[2] === 0x11 && b[3] === 0xE0 &&
      b[4] === 0xA1 && b[5] === 0xB1 && b[6] === 0x1A && b[7] === 0xE1) {
    return 'application/msword';
  }
  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!originAllowed(req.headers.origin)) {
    return res.status(403).json({ ok: false, error: 'Origin not allowed' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.warn('BLOB_READ_WRITE_TOKEN not configured — file uploads disabled');
    return res.status(503).json({ ok: false, error: 'File storage not configured' });
  }

  const body = req.body || {};
  const filename = typeof body.filename === 'string' ? body.filename : '';
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const data = typeof body.data === 'string' ? body.data : '';

  if (!filename || !contentType || !data) {
    return res.status(400).json({ ok: false, error: 'Missing filename, contentType, or data' });
  }
  if (filename.length > 200) {
    return res.status(400).json({ ok: false, error: 'Filename too long' });
  }
  if (!ALLOWED_TYPES.has(contentType)) {
    return res.status(400).json({ ok: false, error: 'File type not permitted' });
  }
  const ext = getExt(filename);
  const allowedExts = EXTENSIONS_BY_TYPE[contentType] || [];
  if (!ext || !allowedExts.includes(ext)) {
    return res.status(400).json({ ok: false, error: 'Filename extension does not match content type' });
  }
  if (data.length > MAX_BASE64_CHARS) {
    return res.status(400).json({ ok: false, error: 'File too large (max 4 MB)' });
  }
  if (!/^[A-Za-z0-9+/=\s]+$/.test(data)) {
    return res.status(400).json({ ok: false, error: 'Invalid base64 data' });
  }

  // Buffer.from('xx', 'base64') silently strips invalid characters rather
  // than throwing, so the previous try/catch was a no-op. We instead validate
  // the input shape above and the resulting byte length here.
  const bytes = Buffer.from(data, 'base64');
  if (bytes.length === 0 || bytes.length > MAX_DECODED_BYTES) {
    return res.status(400).json({ ok: false, error: 'File too large or empty' });
  }

  const detected = detectFileType(bytes);
  if (!detected || detected !== contentType) {
    return res.status(400).json({ ok: false, error: 'File contents do not match declared type' });
  }

  const safe = safeName(filename);
  const pathname = 'contact-attachments/' + Date.now() + '-' + safe;

  try {
    const blobRes = await fetch('https://blob.vercel-storage.com/' + pathname, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': contentType,
        'x-api-version': '7',
        'x-vercel-blob-content-disposition': 'attachment; filename="' + safe + '"',
      },
      body: bytes,
    });

    if (!blobRes.ok) {
      const errText = await blobRes.text();
      console.error('Blob upload error:', blobRes.status, errText);
      return res.status(502).json({ ok: false, error: 'Storage upload failed' });
    }

    const blob = await blobRes.json();
    return res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('Upload fetch error:', err);
    return res.status(500).json({ ok: false, error: 'Upload failed' });
  }
};
