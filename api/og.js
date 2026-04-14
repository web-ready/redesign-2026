import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Oasis of Change';

  // Split long titles at the pipe separator for layout
  const parts = title.split('|').map((s) => s.trim());
  const pageTitle = parts[0] || '';
  const siteName = parts[1] || 'Oasis of Change, Inc.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          background: 'linear-gradient(145deg, #0a0a0a 0%, #111827 50%, #064e3b 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top: decorative accent */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="white"
              />
            </svg>
          </div>
          <span
            style={{
              color: '#9ca3af',
              fontSize: '22px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            {siteName}
          </span>
        </div>

        {/* Center: page title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: pageTitle.length > 40 ? '52px' : '64px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {pageTitle}
          </h1>
        </div>

        {/* Bottom: site URL + green bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              color: '#6b7280',
              fontSize: '20px',
              fontWeight: 400,
            }}
          >
            www.oasisofchange.com
          </span>
          <div
            style={{
              width: '120px',
              height: '4px',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
