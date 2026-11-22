import { useState } from "react";
import { asset } from "../constants";

interface Experience {
  id: string;
  name: string;
  url: string;
  host: string;
  icon?: string;
  /** Background behind a logo whose artwork is white on transparent. */
  plate?: string;
  /** Small status label, e.g. for a project that is not finished yet. */
  tag?: string;
}

const EXPERIENCES: Experience[] = [
  {
    id: "revona",
    name: "Revona",
    url: "https://app.revona.ai",
    host: "app.revona.ai",
    icon: asset("Images/Expirences/revona.png"),
  },
  {
    id: "iqx",
    name: "IQX",
    url: "https://iqx.io",
    host: "iqx.io",
    icon: asset("Images/Expirences/iqx.svg"),
  },
  {
    id: "orchid",
    name: "Orchid Pharmed",
    url: "https://orchidpharmed.com/",
    host: "orchidpharmed.com",
    icon: asset("Images/Expirences/Orchid.png"),
  },
  {
    id: "lawmingo",
    name: "Lawmingo",
    url: "https://lawmingo.com",
    host: "lawmingo.com",
    icon: asset("Images/Expirences/lawmingo.png"),
  },
];

const PERSONAL_PROJECTS: Experience[] = [
  {
    id: "djvolek",
    name: "DJ Volek",
    url: "https://djvolek.netlify.app",
    host: "djvolek.netlify.app",
  },
  {
    id: "everythingbygorbe",
    name: "Everything by Gorbe",
    url: "https://everythingbygorbe.netlify.app",
    host: "everythingbygorbe.netlify.app",
  },
  {
    id: "fhcube",
    name: "FH Cube",
    url: "https://fhcube.netlify.app",
    host: "fhcube.netlify.app",
    icon: asset("Images/Expirences/fhcube.png"),
    plate: "#2a1160",
  },
  {
    id: "fhenglish",
    name: "FH English",
    url: "https://fhenglish.netlify.app",
    host: "fhenglish.netlify.app",
    icon: asset("Images/Expirences/fhenglish.png"),
    plate: "#2a1160",
  },
  {
    id: "fhgym",
    name: "FH Gym Assistant",
    url: "https://fhgymassistant.netlify.app",
    host: "fhgymassistant.netlify.app",
    icon: asset("Images/Expirences/fhgym.png"),
  },
  {
    id: "fhmusic",
    name: "FH Music",
    url: "https://fhmusic.netlify.app",
    host: "fhmusic.netlify.app",
    icon: asset("Images/Expirences/fhmusic.svg"),
  },
  {
    id: "fhsimplefood",
    name: "FH Simple Food",
    url: "https://fhsimplefoods.netlify.app",
    host: "fhsimplefoods.netlify.app",
    icon: asset("Images/Expirences/fhsimplefood.png"),
    tag: "In progress",
  },
  {
    id: "fhlinks",
    name: "FH Links",
    url: "https://fhlinks.netlify.app",
    host: "fhlinks.netlify.app",
    icon: asset("Images/Expirences/fhlinks.png"),
  },
];

interface ExperiencesAppProps {
  onBrowsingChange?: (browsing: boolean) => void;
}

function IconImg({ exp, size }: { exp: Experience; size: number }) {
  const [failed, setFailed] = useState(false);
  if (failed || !exp.icon) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          background: "#5b8def",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.5,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {exp.name.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={exp.icon}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: size * 0.18,
        flexShrink: 0,
        ...(exp.plate && {
          background: exp.plate,
          padding: size * 0.12,
          boxSizing: "border-box",
        }),
      }}
    />
  );
}

export function ExperiencesApp({ onBrowsingChange }: ExperiencesAppProps) {
  const [active, setActive] = useState<Experience | null>(null);

  const open = (exp: Experience) => {
    setActive(exp);
    onBrowsingChange?.(true);
  };
  const goHome = () => {
    setActive(null);
    onBrowsingChange?.(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#dee1e6",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          height: 44,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 10px",
          background: "#dee1e6",
        }}
      >
        <ToolbarButton
          label="Back"
          disabled={!active}
          onClick={goHome}
          glyph="←"
        />
        <ToolbarButton label="Home" onClick={goHome} glyph="⌂" />

        <div
          style={{
            flex: 1,
            height: 30,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
            background: "white",
            borderRadius: 15,
            fontSize: 13,
            color: "#3c4043",
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: 12, color: "#5f6368" }}>
            {active ? "🔒" : "🔍"}
          </span>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {active ? active.url : "Search projects or pick one below"}
          </span>
        </div>

        {active && (
          <a
            href={active.url}
            target="_blank"
            rel="noreferrer"
            title="Open in a real browser tab"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 15,
              textDecoration: "none",
              color: "#3c4043",
              fontSize: 15,
            }}
          >
            ⧉
          </a>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, position: "relative", background: "white" }}>
        {active ? (
          <SiteFrame exp={active} />
        ) : (
          <Chooser onPick={open} />
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  glyph,
  label,
  onClick,
  disabled = false,
}: {
  glyph: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        all: "unset",
        width: 30,
        height: 30,
        borderRadius: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "#b0b3b8" : "#3c4043",
        fontSize: 16,
        transition: "background 80ms ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {glyph}
    </button>
  );
}

function Chooser({ onPick }: { onPick: (exp: Experience) => void }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
        background:
          "radial-gradient(120% 80% at 50% 0%, #f5f7fb 0%, #eef1f6 60%, #e7ebf2 100%)",
      }}
    >
      <h1
        style={{
          margin: "8px 0 4px",
          fontSize: 26,
          fontWeight: 600,
          color: "#202124",
        }}
      >
        Experiences
      </h1>
      <p style={{ margin: "0 0 36px", fontSize: 14, color: "#5f6368" }}>
        Pick a project to open it inside the browser.
      </p>

      <ProjectSection title="Work" items={EXPERIENCES} onPick={onPick} />
      <ProjectSection
        title="Personal Projects"
        items={PERSONAL_PROJECTS}
        onPick={onPick}
      />
    </div>
  );
}

function ProjectSection({
  title,
  items,
  onPick,
}: {
  title: string;
  items: Experience[];
  onPick: (exp: Experience) => void;
}) {
  return (
    <div style={{ width: "100%", maxWidth: 760, marginBottom: 36 }}>
      <h2
        style={{
          margin: "0 0 14px",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: "#5f6368",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 18,
          width: "100%",
        }}
      >
        {items.map((exp) => (
          <button
            key={exp.id}
            type="button"
            onClick={() => onPick(exp)}
            style={{
              all: "unset",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "24px 16px",
              background: "white",
              borderRadius: 14,
              border: "1px solid #e3e6ea",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              transition: "transform 120ms ease, box-shadow 120ms ease",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)";
            }}
          >
            <IconImg exp={exp} size={56} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>
                {exp.name}
              </div>
              <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>
                {exp.host}
              </div>
              {exp.tag && (
                <div
                  title="Not finished yet: an early idea, not demo-ready"
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: "#fff4e5",
                    border: "1px solid #f5c98b",
                    color: "#a15c07",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {exp.tag}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SiteFrame({ exp }: { exp: Experience }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          color: "#5f6368",
          fontSize: 13,
          textAlign: "center",
          padding: 24,
        }}
      >
        <IconImg exp={exp} size={48} />
        <div>Loading {exp.name}…</div>
        <div style={{ fontSize: 12, maxWidth: 360 }}>
          If it stays blank, the site blocks embedding.{" "}
          <a href={exp.url} target="_blank" rel="noreferrer" style={{ color: "#1a73e8" }}>
            Open {exp.host} in a new tab
          </a>
          .
        </div>
      </div>
      <iframe
        key={exp.id}
        src={exp.url}
        title={exp.name}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
