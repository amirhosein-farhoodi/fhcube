import type { MenuIconName } from "./menu";

export function NavIcon({ name }: { name: MenuIconName }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9h13v-9" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="m4 17 5-4.5 4 3.5 3-2.5 5 4" />
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <path d="M3 6.5h6l2 2.5h10v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "cat":
      return (
        <svg {...common}>
          <path d="M4 9 5.7 4 9.2 7" />
          <path d="M20 9 18.3 4 14.8 7" />
          <path d="M5.7 8c-.8 1.9-.6 4.4.9 6.2C8.1 16.2 9.9 17 12 17s3.9-.8 5.4-2.8c1.5-1.8 1.7-4.3.9-6.2" />
          <path d="M9.4 11.4v1.4M14.6 11.4v1.4" />
          <path d="M12 14.2 9.8 14.8M12 14.2l2.2.6" />
        </svg>
      );
    case "window":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="5.5" />
        </svg>
      );
  }
}
