import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const alt = 'DXLR luxury streetwear social preview';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at top left, rgba(184,148,92,0.18), transparent 34%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.1), transparent 26%), linear-gradient(135deg, #050505 0%, #111111 58%, #1a1510 100%)',
          color: '#f6f1e8',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 28,
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.08)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 54,
            bottom: -12,
            display: 'flex',
            fontSize: 248,
            lineHeight: 0.82,
            fontWeight: 800,
            letterSpacing: -12,
            color: 'rgba(255,255,255,0.05)',
            zIndex: 0,
          }}
        >
          DXLR.
        </div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            padding: '74px 84px',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              maxWidth: 690,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                letterSpacing: 10,
                textTransform: 'uppercase',
                color: 'rgba(246,241,232,0.68)',
              }}
            >
              Engineered Ease
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 176,
                  lineHeight: 0.84,
                  fontWeight: 800,
                  letterSpacing: -10,
                  color: '#ffffff',
                  textShadow: '0 18px 50px rgba(0,0,0,0.24)',
                }}
              >
                DXLR.
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 32,
                  lineHeight: 1.3,
                  color: '#f3ede2',
                  maxWidth: 560,
                }}
              >
                Quiet luxury streetwear with a sharper silhouette.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 18,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  padding: '18px 28px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.05)',
                  fontSize: 20,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: '#f7f1e7',
                }}
              >
                Premium Essentials
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  lineHeight: 1,
                  color: '#b8945c',
                  textShadow: '0 0 18px rgba(184,148,92,0.28)',
                }}
              >
                ★
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 22,
                  color: 'rgba(246,241,232,0.7)',
                }}
              >
                Cairo Edition
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: 290,
              padding: '32px 28px',
              borderRadius: 28,
              border: '1px solid rgba(255,255,255,0.1)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              boxShadow: '0 28px 60px rgba(0,0,0,0.24)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 18,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: 'rgba(246,241,232,0.62)',
                }}
              >
                Signature Edit
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: '#ffffff',
                }}
              >
                Premium tech-inspired fashion
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 17,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: 'rgba(246,241,232,0.56)',
                }}
              >
                Explore
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 22,
                  color: '#f6f1e8',
                }}
              >
                Hoodies, tees, and pants with a luxury minimal finish.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
