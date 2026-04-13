// api/contact.js
// Vercel serverless function — relays contact form submissions to Slack.
//
// Required env var (set in Vercel Dashboard → Project → Settings → Environment
// Variables): SLACK_WEBHOOK_URL
// Never commit the webhook URL to the repo; it lives only on Vercel's servers.

const MIN_FORM_TIME_MS = 3000;
const MAX_MESSAGE_LEN = 5000;

// Per-inquiry presentation: emoji icon, accent-bar color, short display label.
const INQUIRY_META = {
  'general':       { emoji: '💬', color: '#6b7280', label: 'General Inquiry' },
  'volunteer':     { emoji: '🙌', color: '#16a34a', label: 'Volunteer' },
  'partnership':   { emoji: '🤝', color: '#2563eb', label: 'Partnership' },
  'media':         { emoji: '📰', color: '#dc2626', label: 'Press & Media' },
  'speaking':      { emoji: '🎤', color: '#7c3aed', label: 'Speaking Engagement' },
  'web-ready':     { emoji: '🌐', color: '#0891b2', label: 'Web-Ready Services' },
  'wra-platform':  { emoji: '🧰', color: '#0d9488', label: 'WRA Platform' },
  'stw':           { emoji: '📅', color: '#059669', label: 'Sustainable Technology Week' },
  'vcasse':        { emoji: '🧠', color: '#7c3aed', label: 'VCASSE' },
  'tree-planting': { emoji: '🌱', color: '#16a34a', label: 'Tree Planting' },
};

const FIELD_LABELS = {
  first_name: 'First name',
  last_name: 'Last name',
  email: 'Email',
  phone: 'Phone',
  organization: 'Organization',
  organization_type: 'Org type',
  website: 'Website',
  linkedin: 'LinkedIn',
  role: 'Role',
  employees: 'Team size',
  volunteer_interest: 'Areas of interest',
  volunteer_availability: 'Availability',
  volunteer_skills: 'Skills / experience',
  partnership_type: 'Partnership type',
  partnership_mission: 'Organization mission',
  partnership_goals: 'Goals',
  media_outlet: 'Outlet',
  media_request_type: 'Request type',
  media_deadline: 'Deadline',
  media_angle: 'Story angle',
  media_file_url: 'Attached file',
  speaking_event: 'Event name',
  speaking_date: 'Event date',
  speaking_format: 'Format',
  speaking_audience_size: 'Audience size',
  speaking_topic: 'Topics',
  speaking_details: 'Additional details',
  webready_service: 'Services needed',
  webready_url: 'Current URL',
  webready_goals: 'Goals',
  wra_budget: 'Annual budget',
  wra_referral: 'How they heard about WRA',
  wra_support: 'Support needed',
  stw_interest: 'Participation type',
  stw_topic: 'Proposed topic',
  vcasse_interest: 'Areas of interest',
  vcasse_description: 'Description',
  tree_interest: 'Interest',
  message: 'Message',
  referral_source: 'Referral source',
};

const SECTION_FIELDS = {
  'volunteer':     ['volunteer_interest', 'volunteer_availability', 'volunteer_skills'],
  'partnership':   ['partnership_type', 'partnership_mission', 'partnership_goals'],
  'media':         ['media_outlet', 'media_request_type', 'media_deadline', 'media_angle', 'media_file_url'],
  'speaking':      ['speaking_event', 'speaking_date', 'speaking_format', 'speaking_audience_size', 'speaking_topic', 'speaking_details'],
  'web-ready':     ['webready_service', 'webready_url', 'webready_goals'],
  'wra-platform':  ['wra_budget', 'wra_referral', 'wra_support'],
  'stw':           ['stw_interest', 'stw_topic'],
  'vcasse':        ['vcasse_interest', 'vcasse_description'],
  'tree-planting': ['tree_interest'],
};

// Fields whose values should be rendered as hyperlinks in Slack.
const URL_FIELDS = new Set(['website', 'linkedin', 'media_file_url', 'webready_url']);

// Escape characters that have special meaning in Slack mrkdwn.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

// Render a field's value for Slack. If the field is "other" and the user
// specified something in the paired `_other` text input, render as
// "Other — <their text>" instead of just "Other".
function displayValue(data, key) {
  const v = data[key];
  const other = data[key + '_other'];
  const hasOther = isFilled(other);

  if (Array.isArray(v)) {
    return v.map(item => {
      if (item === 'other' && hasOther) return 'Other — ' + other;
      return item;
    }).map(esc).join(', ');
  }
  if (v === 'other' && hasOther) return esc('Other — ' + other);
  if (URL_FIELDS.has(key) && isFilled(v)) {
    const safe = esc(String(v));
    return `<${safe}|${safe}>`;
  }
  return esc(v);
}

// Short, human-readable submission ID. Unambiguous alphabet (no 0/O/I/1/L).
function genSubmissionId() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return 'S-' + s;
}

function buildBlocks(data, submissionId) {
  const inquiry = data.inquiry_type || 'general';
  const meta = INQUIRY_META[inquiry] || INQUIRY_META['general'];
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Unknown';
  const blocks = [];

  // ── Header ─────────────────────────────────────────────────────────────
  blocks.push({
    type: 'header',
    text: { type: 'plain_text', text: `${meta.emoji} ${meta.label}`, emoji: true },
  });

  // ── Contact ────────────────────────────────────────────────────────────
  const contactFields = [
    `*Name:*\n${esc(name)}`,
    `*Email:*\n<mailto:${esc(data.email)}|${esc(data.email)}>`,
  ];
  if (isFilled(data.phone)) contactFields.push(`*Phone:*\n${esc(data.phone)}`);

  blocks.push({
    type: 'section',
    fields: contactFields.map(t => ({ type: 'mrkdwn', text: t })),
  });

  // ── Organization ───────────────────────────────────────────────────────
  const orgKeys = ['organization', 'organization_type', 'website', 'linkedin', 'role', 'employees'];
  const orgFilled = orgKeys.filter(k => isFilled(data[k]));
  if (orgFilled.length) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '*🏢 Organization*' },
    });
    blocks.push({
      type: 'section',
      fields: orgFilled.map(k => ({
        type: 'mrkdwn',
        text: `*${FIELD_LABELS[k]}:*\n${displayValue(data, k)}`,
      })),
    });
  }

  // ── Inquiry-specific details ───────────────────────────────────────────
  const sectionKeys = SECTION_FIELDS[inquiry] || [];
  const typeFilled = sectionKeys.filter(k => isFilled(data[k]));
  if (typeFilled.length) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*${meta.emoji} ${meta.label} details*` },
    });
    // Short scalars go in a 2-column fields layout; longer text gets its own
    // section block so it renders in full.
    const shortFields = [];
    const longFields = [];
    for (const k of typeFilled) {
      const val = data[k];
      const strVal = Array.isArray(val) ? val.join(', ') : String(val);
      if (!Array.isArray(val) && strVal.length > 80) longFields.push(k);
      else shortFields.push(k);
    }
    if (shortFields.length) {
      for (let i = 0; i < shortFields.length; i += 10) {
        const chunk = shortFields.slice(i, i + 10);
        blocks.push({
          type: 'section',
          fields: chunk.map(k => ({
            type: 'mrkdwn',
            text: `*${FIELD_LABELS[k]}:*\n${displayValue(data, k)}`,
          })),
        });
      }
    }
    for (const k of longFields) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `*${FIELD_LABELS[k]}:*\n${displayValue(data, k)}` },
      });
    }
  }

  // ── Message ────────────────────────────────────────────────────────────
  if (isFilled(data.message)) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*✉️ Message*\n>${esc(truncate(data.message, 2800)).replace(/\n/g, '\n>')}` },
    });
  }

  // ── Action button: Reply via email ─────────────────────────────────────
  if (isFilled(data.email)) {
    const subject = 'Re: Your ' + meta.label + ' inquiry';
    const body = 'Hi ' + (data.first_name || 'there') + ',\n\nThanks for reaching out to Oasis of Change.\n\n';
    const mailto = 'mailto:' + encodeURI(String(data.email))
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    blocks.push({
      type: 'actions',
      elements: [{
        type: 'button',
        text: { type: 'plain_text', text: '✉️ Reply via email', emoji: true },
        url: mailto,
        style: 'primary',
      }],
    });
  }

  // ── Footer ─────────────────────────────────────────────────────────────
  const footer = [];
  footer.push(`*ID:* \`${submissionId}\``);
  if (isFilled(data.referral_source)) {
    footer.push(`Heard about us: ${displayValue(data, 'referral_source')}`);
  }
  if (data.newsletter === 'on' || data.newsletter === true || data.newsletter === 'true') {
    footer.push('✉️ Newsletter opt-in');
  }
  footer.push(new Date().toISOString());

  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: footer.join(' · ') }],
  });
  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: '💬 _Reply in thread to track follow-up_' }],
  });

  return { blocks, color: meta.color, label: meta.label, name };
}

module.exports = async (req, res) => {
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

  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch (e) { data = {}; }
  }
  data = data || {};

  // ── Spam protection ──────────────────────────────────────────────────
  if (isFilled(data.website_url)) {
    return res.status(200).json({ ok: true });
  }
  const loadedAt = Number(data.form_loaded_at);
  if (loadedAt && (Date.now() - loadedAt) < MIN_FORM_TIME_MS) {
    return res.status(200).json({ ok: true });
  }

  // ── Server-side validation ───────────────────────────────────────────
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
  if (!INQUIRY_META[data.inquiry_type]) {
    return res.status(400).json({ ok: false, error: 'Invalid inquiry type' });
  }

  // ── Build and send to Slack ──────────────────────────────────────────
  const submissionId = genSubmissionId();
  const { blocks, color, label, name } = buildBlocks(data, submissionId);

  // The `attachments` wrapper gives us the colored accent bar on the left of
  // the Slack message — the easiest way to visually distinguish inquiry types
  // at a glance in the channel.
  const slackPayload = {
    text: `New ${label} inquiry from ${name} (${submissionId})`,
    attachments: [{ color, blocks }],
  };

  try {
    const slackRes = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });

    if (!slackRes.ok) {
      const body = await slackRes.text();
      console.error('Slack webhook failed:', slackRes.status, body);
      return res.status(502).json({ ok: false, error: 'Upstream error' });
    }

    return res.status(200).json({ ok: true, id: submissionId });
  } catch (err) {
    console.error('Slack fetch error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to send' });
  }
};
