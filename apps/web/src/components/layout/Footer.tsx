import type { Route } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

function SpikeMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      style={{ opacity: 0.6 }}
    >
      <path d="M10 0 L11.2 8.8 L20 10 L11.2 11.2 L10 20 L8.8 11.2 L0 10 L8.8 8.8 Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface-dark)",
        color: "var(--on-dark-soft)",
        padding: "64px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <SpikeMark />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--on-dark)",
            }}
          >
            {siteConfig.name}
          </span>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid color-mix(in srgb, var(--on-dark) 12%, transparent)",
            marginBottom: 32,
          }}
        />

        {/* Links grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "32px 48px",
            marginBottom: 48,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--on-dark-soft)",
                marginBottom: 16,
              }}
            >
              Plateforme
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/demarches" as Route, label: "Démarches" },
                { href: "/assistant" as Route, label: "Assistant" },
                { href: "/sources" as Route, label: "Sources" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover-color-on-dark"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      color: "var(--on-dark-soft)",
                      transition: "color 0.12s ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--on-dark-soft)",
                marginBottom: 16,
              }}
            >
              Modules
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/pulse" as Route, label: "Digital Pulse" },
                { href: "/ux-lab" as Route, label: "CivicUX Lab" },
                { href: "/open-civic-kit" as Route, label: "OpenCivic Kit" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover-color-on-dark"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      color: "var(--on-dark-soft)",
                      transition: "color 0.12s ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--on-dark-soft)",
                marginBottom: 16,
              }}
            >
              Ressources
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/methode-verification" as Route, label: "Méthode" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover-color-on-dark"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      color: "var(--on-dark-soft)",
                      transition: "color 0.12s ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid color-mix(in srgb, var(--on-dark) 10%, transparent)",
            marginBottom: 24,
          }}
        />

        {/* Disclaimer */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 16,
            alignItems: "end",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--on-dark-soft)",
              maxWidth: 560,
            }}
          >
            {siteConfig.disclaimer}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              color: "var(--on-dark-soft)",
              opacity: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            Mode local · données demo · IA mock
          </p>
        </div>
      </div>
    </footer>
  );
}
