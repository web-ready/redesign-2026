// api/upload.js
// Vercel serverless function — accepts a base64-encoded file from the contact
// form and stores it in Vercel Blob, returning a public download URL.
//
// Required env var (Vercel Dashboard → Project → Settings → Environment
// Variables): BLOB_READ_WRITE_TOKEN
// If the token is not set, the endpoint returns an error and the contact form
// omits the file URL from the Slack message rather than failing entirely.

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MAX_BASE64_CHARS = 5.5 * 1024 * 1024; // ~4 MB decoded

function safeName(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.warn('BLOB_READ_WRITE_TOKEN not configured — file uploads disabled');
    return res.status(503).json({ ok: false, error: 'File storage not configured' });
  }

  const { filename, contentType, data } = req.body || {};

  if (!filename || !contentType || !data) {
    return res.status(400).json({ ok: false, error: 'Missing filename, contentType, or data' });
  }
  if (!ALLOWED_TYPES.has(contentType)) {
    return res.status(400).json({ ok: false, error: 'File type not permitted' });
  }
  if (String(data).length > MAX_BASE64_CHARS) {
    return res.status(400).json({ ok: false, error: 'File too large (max 4 MB)' });
  }

  let bytes;
  try {
    bytes = Buffer.from(data, 'base64');
  } catch (e) {
    return res.status(400).json({ ok: false, error: 'Invalid base64 data' });
  }

  const pathname = 'contact-attachments/' + Date.now() + '-' + safeName(filename);

  try {
    const blobRes = await fetch('https://blob.vercel-storage.com/' + pathname, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': contentType,
        'x-api-version': '7',
        'x-vercel-blob-content-disposition': 'attachment; filename="' + safeName(filename) + '"',
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
