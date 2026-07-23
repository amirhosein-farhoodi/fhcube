import { ICONS } from "../constants";

const ACCENT = "#2b88d8";
const FONT = "'Segoe UI', system-ui, sans-serif";

const HERO_QUOTE =
  "Living and working here is like having my own little capsule, far from Earth — quiet, self-contained, and packed with everything I need to build whole worlds.";

const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: "Why a room?",
    body: "This portfolio is a room because that is honestly how I love to work: in a small, self-contained world of my own, focused and far from the noise. The window looks out onto deep space, and that suits me — the distance keeps things calm and clear, and it turns this little room into a place where I can go deep and actually make things.",
  },
  {
    heading: "Everything I need is right here",
    body: "The desk, the laptop, a speaker playing something good, a few things on the shelf that mean something — that is not missing anything, it is exactly enough. I have learned to build whole worlds out of what is already within arm's reach, and there is real joy in doing a lot with a little. Working with what I have makes me sharper, more inventive, more myself.",
  },
  {
    heading: "A calm base — not a bubble",
    body: "This room is where I do my most focused work, but it is not a place to hide away. The same window that opens onto deep space is how I reach out — collaborating with teammates, learning from people sharper than me, and sending what I make into the world. I value the focus a quiet base gives me, and I value building alongside other people just as much.",
  },
];

const CLOSING =
  "So this is not a story about being stuck — it is a small world I have made my own. Proof that with curiosity and a little, you can build a lot, even very far from Earth.";

export function AboutApp() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        background: "#f3f4f6",
        fontFamily: FONT,
        display: "flex",
        justifyContent: "center",
        padding: "28px 18px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          background: "white",
          borderRadius: 12,
          border: "1px solid #e3e6ea",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          overflow: "hidden",
          height: "fit-content",
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "30px 28px 26px",
            color: "#eef2ff",
            background:
              "radial-gradient(120% 140% at 18% 12%, #243056 0%, #131a30 45%, #080b16 100%)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(1.4px 1.4px at 22% 30%, rgba(255,255,255,0.8), transparent), radial-gradient(1.2px 1.2px at 68% 18%, rgba(255,255,255,0.6), transparent), radial-gradient(1.6px 1.6px at 82% 62%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 40% 72%, rgba(255,255,255,0.5), transparent), radial-gradient(1.2px 1.2px at 12% 80%, rgba(255,255,255,0.55), transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <img
              src={ICONS.about}
              alt=""
              style={{ width: 30, height: 30 }}
              draggable={false}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
                About This Room
              </h1>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#8fa3d6",
                }}
              >
                The concept behind this portfolio
              </p>
            </div>
          </div>
          <p
            style={{
              position: "relative",
              margin: 0,
              fontSize: 16,
              lineHeight: 1.55,
              fontStyle: "italic",
              color: "#dfe6ff",
              borderLeft: `3px solid ${ACCENT}`,
              paddingLeft: 14,
            }}
          >
            {HERO_QUOTE}
          </p>
        </div>

        <div style={{ padding: "24px 28px 28px" }}>
          {SECTIONS.map((s) => (
            <section key={s.heading} style={{ marginBottom: 22 }}>
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: ACCENT,
                }}
              >
                {s.heading}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: "#3a3f47",
                }}
              >
                {s.body}
              </p>
            </section>
          ))}

          <p
            style={{
              margin: "0 0 18px",
              fontSize: 14.5,
              lineHeight: 1.7,
              color: "#3a3f47",
            }}
          >
            {CLOSING}
          </p>

          <div
            style={{
              borderTop: "1px solid #e3e6ea",
              paddingTop: 14,
              fontSize: 14,
              color: "#5f6368",
            }}
          >
            — <strong style={{ color: "#202124" }}>Amirhosein Farhoodi</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
