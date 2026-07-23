import { useState } from "react";

const TO_EMAIL = "farhoodiamirhosein.primary@gmail.com";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

type Status = "idle" | "sending" | "sent" | "error";

const FIELD_BORDER = "#c8ccd2";
const ACCENT = "#2b88d8";

export function DirectContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDescription("");
  };

  const sendViaMailto = () => {
    const body =
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || "—"}\n\n` +
      `${description}\n`;
    const href =
      `mailto:${TO_EMAIL}` +
      `?subject=${encodeURIComponent(`Portfolio contact from ${name}`)}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !description.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }

    setStatus("sending");

    if (!WEB3FORMS_KEY) {
      sendViaMailto();
      setStatus("sent");
      reset();
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio contact from ${name}`,
          from_name: name,
          replyto: email,
          name,
          email,
          phone,
          message: description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        reset();
      } else {
        setStatus("error");
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again or email me directly.");
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#3c4043",
    marginBottom: 5,
    letterSpacing: "0.02em",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 11px",
    fontSize: 14,
    color: "#202124",
    background: "white",
    border: `1px solid ${FIELD_BORDER}`,
    borderRadius: 6,
    outline: "none",
    fontFamily: "inherit",
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = ACCENT;
    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(43,136,216,0.15)`;
  };
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = FIELD_BORDER;
    e.currentTarget.style.boxShadow = "none";
  };

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
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "white",
          borderRadius: 12,
          border: "1px solid #e3e6ea",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          height: "fit-content",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#202124" }}>
            Direct Contact
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#5f6368" }}>
            Send me a message — it lands straight in my inbox.
          </p>
        </div>

        {status === "sent" ? (
          <div
            style={{
              padding: "16px 14px",
              background: "#e7f5ec",
              border: "1px solid #b6e0c4",
              borderRadius: 8,
              color: "#1e7e44",
              fontSize: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <span>✓ Thanks! Your message is on its way.</span>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              style={{
                all: "unset",
                cursor: "pointer",
                color: ACCENT,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Send another
            </button>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="dc-name" style={labelStyle}>
                Name *
              </label>
              <input
                id="dc-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={focus}
                onBlur={blur}
                style={inputStyle}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="dc-email" style={labelStyle}>
                Email *
              </label>
              <input
                id="dc-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={focus}
                onBlur={blur}
                style={inputStyle}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="dc-phone" style={labelStyle}>
                Phone number
              </label>
              <input
                id="dc-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={focus}
                onBlur={blur}
                style={inputStyle}
                placeholder="Optional"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="dc-desc" style={labelStyle}>
                Message *
              </label>
              <textarea
                id="dc-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={focus}
                onBlur={blur}
                rows={5}
                style={{ ...inputStyle, resize: "vertical", minHeight: 96 }}
                placeholder="Tell me about your project, role, or question…"
              />
            </div>

            {error && (
              <div style={{ color: "#d33", fontSize: 13 }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                all: "unset",
                textAlign: "center",
                cursor: status === "sending" ? "default" : "pointer",
                background: status === "sending" ? "#7fb4e0" : ACCENT,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                padding: "11px 0",
                borderRadius: 7,
                transition: "background 120ms ease",
              }}
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>

            <p style={{ margin: 0, fontSize: 11, color: "#9aa0a6", textAlign: "center" }}>
              Or email me directly at {TO_EMAIL}
            </p>
          </>
        )}
      </form>
    </div>
  );
}
