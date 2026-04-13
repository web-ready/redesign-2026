// api/contact.js
// Vercel serverless function — relays contact form submissions to Slack.
//
// Required env var (set in Vercel Dashboard → Project → Settings → Environment
// Variables): SLACK_WEBHOOK_URL
// Never commit the webhook URL to the repo; it lives only on Vercel's servers.

const MIN_FORM_TIME_MS = 3000;
const MAX_MESSAGE_LEN = 5000;

const INQUIRY_LABELS = {
  'general':       'General Inquiry',
  'volunteer':     'Volunteer',
  'partnership':   'Partnership / Collaboration',
  'media':         'Press & Media',
  'speaking':      'Speaking Engagement',
  'web-ready':     'Web-Ready Services',
  'wra-platform':  'WRA Platform Access',
  'stw':           'Sustainable Technology Week',
  'vcasse':        'VCASSE',
  'tree-planting': 'Tree Planting / Environmental Programs',
};

const FIELD_LABELS = {
  // contact
  first_name: 'First name',
  last_name: 'Last name',
  email: 'Email',
  phone: 'Phone',
  // organization
  organization: 'Organization',
  organization_type: 'Org type',
  website: 'Website',
  role: 'Role',
  // volunteer
  volunteer_interest: 'Areas of interest',
  volunteer_availability: 'Availability',
  volunteer_skills: 'Skills / experience',
  // partnership
  partnership_type: 'Partnership type',
  partnership_mission: 'Organization mission',
  partnership_goals: 'Goals',
  // media
  media_outlet: 'Outlet',
  media_request_type: 'Request type',
  media_deadline: 'Deadline',
  media_angle: 'Story angle',
  // speaking
  speaking_event: 'Event name',
  speaking_date: 'Event date',
  speaking_format: 'Format',
  speaking_audience_size: 'Audience size',
  speaking_topic: 'Topics',
  speaking_details: 'Additional details',
  // web-ready
  webready_service: 'Services needed',
  webready_url: 'Current URL',
  webready_goals: 'Goals',
  // wra-platform
  wra_budget: 'Annual budget',
  wra_referral: 'How they heard about WRA',
  wra_support: 'Support needed',
  // stw
  stw_interest: 'Participation type',
  stw_topic: 'Proposed topic',
  // vcasse
  vcasse_interest: 'Areas of interest',
  vcasse_description: 'Description',
  // tree
  tree_interest: 'Interest',
  // general
  message: 'Message',
  referral_source: 'Referral source',
};

const SECTION_FIELDS = {
  'volunteer':     ['volunteer_interest', 'volunteer_availability', 'volunteer_skills'],
  'partnership':   ['partnership_type', 'partnership_mission', 'partnership_goals'],
  'media':         ['media_outlet', 'media_request_type', 'media_deadline', 'media_angle'],
  'speaking':      ['speaking_event', 'speaking_date', 'speaking_format', 'speaking_audience_size', 'speaking_topic', 'speaking_details'],
  'web-ready':     ['webready_service', 'webready_url', 'webready_goals'],
  'wra-platform':  ['wra_budget', 'wra_referral', 'wra_support'],
  'stw':           ['stw_interest', 'stw_topic'],
  'vcasse':        ['vcasse_interest', 'vcasse_description'],
  'tree-planting': ['tree_interest'],
};

// Escape characters that have special meaning in Slack mrkdwn.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatValue(v) {
  if (Array.isArray(v)) return v.map(esc).join(', ');
  return esc(v);
}

function isFilled(v) {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  return String(v).trim() !== '';
}

function truncate(s, n) {
  s = String(s);
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function buildBlocks(data) {
  const inquiry = data.inquiry_type || 'general';
  const inquiryLabel = INQUIRY_LABELS[inquiry] || 'Contact';
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Unknown';
  const blocks = [];

  // Header
  blocks.push({
    type: 'header',
    text: { type: 'plain_text', text: `📬 New contact: ${inquiryLabel}` },
  });

  // Contact info
  const contactFields = [];
  contactFields.push(`*Name:*\n${esc(name)}`);
  contactFields.push(`*Email:*\n<mailto:${esc(data.email)}|${esc(data.email)}>`);
  if (isFilled(data.phone)) contactFields.push(`*Phone:*\n${esc(data.phone)}`);

  blocks.push({
    type: 'section',
    fields: contactFields.map(t => ({ type: 'mrkdwn', text: t })),
  });

  // Organization (only if any field is filled)
  const orgKeys = ['organization', 'organization_type', 'website', 'role'];
  const orgFilled = orgKeys.filter(k => isFilled(data[k]));
  if (orgFilled.length) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '*Organization*' },
    });
    blocks.push({
      type: 'section',
      fields: orgFilled.map(k => ({
        type: 'mrkdwn',
        text: `*${FIELD_LABELS[k]}:*\n${formatValue(data[k])}`,
      })),
    });
  }

  // Inquiry-type-specific fields
  const sectionKeys = SECTION_FIELDS[inquiry] || [];
  const typeFilled = sectionKeys.filter(k => isFilled(data[k]));
  if (typeFilled.length) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*${inquiryLabel} details*` },
    });
    // Split short scalar values into a 2-column fields section; long text values
    // get their own section block so they render in full.
    const shortFields = [];
    const longFields = [];
    for (const k of typeFilled) {
      const val = data[k];
      const strVal = Array.isArray(val) ? val.join(', ') : String(val);
      if (!Array.isArray(val) && strVal.length > 80) longFields.push(k);
      else shortFields.push(k);
    }
    if (shortFields.length) {
      // Slack fields max 10; chunk if needed
      for (let i = 0; i < shortFields.length; i += 10) {
        const chunk = shortFields.slice(i, i + 10);
        blocks.push({
          type: 'section',
          fields: chunk.map(k => ({
            type: 'mrkdwn',
            text: `*${FIELD_LABELS[k]}:*\n${formatValue(data[k])}`,
          })),
        });
      }
    }
    for (const k of longFields) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `*${FIELD_LABELS[k]}:*\n${formatValue(data[k])}` },
      });
    }
  }

  // Message
  if (isFilled(data.message)) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Message:*\n${esc(truncate(data.message, 2800))}` },
    });
  }

  // Footer context
  const footer = [];
  if (isFilled(data.referral_source)) footer.push(`Heard about us: ${esc(data.referral_source)}`);
  if (data.newsletter === 'on' || data.newsletter === true || data.newsletter === 'true') {
    footer.push('✉️ Newsletter opt-in');
  }
  footer.push(new Date().toISOString());

  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: footer.join(' · ') }],
  });

  return blocks;
}

module.exports = async (req, res) => {
  // CORS headers (same-origin only on Vercel; still explicit for clarity)
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.error('SLACK_WEBHOOK_URL is not set');
    return res.status(500).json({ ok: false, error: 'Server misconfigured' });
  }

  // Vercel auto-parses JSON bodies when Content-Type is application/json.
  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch (e) { data = {}; }
  }
  data = data || {};

  // ── Spam protection ──────────────────────────────────────────────────────

  // Honeypot: hidden field only bots fill. Silently accept (200) so bots don't
  // retry with a different strategy; never forward to Slack.
  if (isFilled(data.website_url)) {
    return res.status(200).json({ ok: true });
  }

  // Minimum form-fill time: reject submissions that happen faster than a human
  // could realistically complete the form.
  const loadedAt = Number(data.form_loaded_at);
  if (loadedAt && (Date.now() - loadedAt) < MIN_FORM_TIME_MS) {
    return res.status(200).json({ ok: true });
  }

  // ── Server-side validation ───────────────────────────────────────────────
  const missing = [];
  if (!isFilled(data.inquiry_type)) missing.push('inquiry_type');
  if (!isFilled(data.first_name))   missing.push('first_name');
  if (!isFilled(data.last_name))    missing.push('last_name');
  if (!isFilled(data.email))        missing.push('email');
  if (!isFilled(data.message))      missing.push('message');
  if (!data.privacy_consent)        missing.push('privacy_consent');

  if (missing.length) {
    return res.status(400).json({ ok: false, error: 'Missing required fields', fields: missing });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' });
  }

  if (String(data.message).length > MAX_MESSAGE_LEN) {
    return res.status(400).json({ ok: false, error: 'Message too long' });
  }

  if (!INQUIRY_LABELS[data.inquiry_type]) {
    return res.status(400).json({ ok: false, error: 'Invalid inquiry type' });
  }

  // ── Post to Slack ────────────────────────────────────────────────────────
  const inquiryLabel = INQUIRY_LABELS[data.inquiry_type];
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ');
  const blocks = buildBlocks(data);

  try {
    const slackRes = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New contact form submission: ${inquiryLabel} from ${name}`,
        blocks,
      }),
    });

    if (!slackRes.ok) {
      const body = await slackRes.text();
      console.error('Slack webhook failed:', slackRes.status, body);
      return res.status(502).json({ ok: false, error: 'Upstream error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Slack fetch error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to send' });
  }
};
