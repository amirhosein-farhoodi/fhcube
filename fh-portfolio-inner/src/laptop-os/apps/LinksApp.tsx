const NAME = "Amirhosein Farhoodi";
const EMAIL = "farhoodiamirhosein.primary@gmail.com";
const PHONE = "+989198957843";
const PHONE_DISPLAY = "+98 919 895 7843";
const GITHUB_URL = "https://github.com/amirhosein-farhoodi";
const GITHUB_LABEL = "github.com/amirhosein-farhoodi";

const ACCENT = "#2b88d8";

export function LinksApp() {
  const rows: {
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }[] = [
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE}` },
    { label: "GitHub", value: GITHUB_LABEL, href: GITHUB_URL, external: true },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        background: "#f3f4f6",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        display: "flex",
        justifyContent: "center",
        padding: "28px 18px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "white",
          borderRadius: 12,
          border: "1px solid #e3e6ea",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          height: "fit-content",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: ACCENT,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            AF
          </div>
          <div>
            <h2 style={{ margin: "0 0 2px", fontSize: 19, color: "#202124" }}>
              {NAME}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#5f6368" }}>
              Frontend Engineer — let's connect
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target={r.external ? "_blank" : undefined}
              rel={r.external ? "noreferrer" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 9,
                border: "1px solid #e3e6ea",
                background: "#fafbfc",
                textDecoration: "none",
                color: "#202124",
                transition: "background 120ms ease, border-color 120ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef5fc";
                e.currentTarget.style.borderColor = "#bfdcf5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fafbfc";
                e.currentTarget.style.borderColor = "#e3e6ea";
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#5f6368",
                  letterSpacing: "0.04em",
                  minWidth: 58,
                }}
              >
                {r.label}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: ACCENT,
                  fontWeight: 500,
                  textAlign: "right",
                  wordBreak: "break-all",
                }}
              >
                {r.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
