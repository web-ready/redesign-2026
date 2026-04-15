const satori = require('satori');
const { Resvg } = require('@resvg/resvg-js');

// Cache the font in-memory across warm invocations
let fontData = null;

async function loadFont() {
  if (fontData) return fontData;
  const res = await fetch(
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
  );
  const css = await res.text();
  // Extract the woff2 URL for latin 700
  const urlMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\);[^}]*unicode-range:\s*U\+0000-00FF/);
  if (!urlMatch) throw new Error('Could not find font URL');
  const fontRes = await fetch(urlMatch[1]);
  fontData = await fontRes.arrayBuffer();
  return fontData;
}

function h(type, props, ...children) {
  const flatChildren = children.flat().filter(Boolean);
  return {
    type,
    props: {
      ...props,
      children: flatChildren.length === 1 ? flatChildren[0] : flatChildren.length === 0 ? undefined : flatChildren,
    },
  };
}

module.exports = async function handler(req, res) {
  try {
    const title = (req.query.title || 'Oasis of Change').toString();
    const parts = title.split('|').map((s) => s.trim());
    const pageTitle = parts[0] || '';
    const siteName = parts[1] || 'Oasis of Change, Inc.';

    const font = await loadFont();

    const markup = h(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          background: 'linear-gradient(145deg, #0a0a0a 0%, #111827 50%, #064e3b 100%)',
          fontFamily: 'Inter, sans-serif',
        },
      },
      // Top: icon + site name
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          },
        },
        h('div', {
          style: {
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 700,
          },
        }, '\u2713'),
        h('span', {
          style: {
            color: '#9ca3af',
            fontSize: '22px',
            fontWeight: 400,
          },
        }, siteName)
      ),
      // Center: page title
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          },
        },
        h('div', {
          style: {
            fontSize: pageTitle.length > 40 ? 52 : 64,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          },
        }, pageTitle)
      ),
      // Bottom: URL + accent bar
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        },
        h('span', {
          style: {
            color: '#6b7280',
            fontSize: '20px',
            fontWeight: 400,
          },
        }, 'www.oasisofchange.com'),
        h('div', {
          style: {
            width: '120px',
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
          },
        })
      )
    );

    const svg = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: Buffer.from(font),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: Buffer.from(font),
          weight: 700,
          style: 'normal',
        },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const png = resvg.render().asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
    res.end(png);
  } catch (err) {
    console.error('OG image generation error:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};
