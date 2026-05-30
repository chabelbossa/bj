"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";

import { navItems, siteConfig } from "@/lib/site";

/** Spike-mark simplifié — ✦ en SVG inline */
function SpikeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 0 L11.2 8.8 L20 10 L11.2 11.2 L10 20 L8.8 11.2 L0 10 L8.8 8.8 Z" />
    </svg>
  );
}

export function Header({ dataLabel }: { dataLabel: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: "var(--canvas)",
        borderBottom: "1px solid var(--hairline)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="Accueil DossierBJ"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--ink)",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <SpikeMark />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: 0,
            }}
          >
            {siteConfig.name}
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "var(--muted-soft)",
              background: "var(--surface-card)",
              padding: "3px 8px",
              borderRadius: "var(--radius-pill)",
              marginLeft: 4,
            }}
          >
            {dataLabel}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="header-nav-desktop"
          aria-label="Navigation principale"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--muted)",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                transition: "color 0.12s ease, background 0.12s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                (e.currentTarget as HTMLElement).style.background = "var(--surface-soft)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          className="header-hamburger"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--hairline)",
            background: "var(--canvas)",
            color: "var(--ink)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {menuOpen ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="3" x2="15" y2="15" />
              <line x1="15" y1="3" x2="3" y2="15" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="2" y1="5" x2="16" y2="5" />
              <line x1="2" y1="9" x2="16" y2="9" />
              <line x1="2" y1="13" x2="16" y2="13" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — full-screen cream sheet */}
      {menuOpen && (
        <div
          className="header-mobile-menu"
          style={{
            position: "fixed",
            inset: "64px 0 0 0",
            background: "var(--canvas)",
            zIndex: 49,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          <nav
            aria-label="Navigation mobile"
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "var(--ink)",
                  padding: "14px 16px",
                  borderRadius: "var(--radius-md)",
                  display: "block",
                  borderBottom: "1px solid var(--hairline-soft)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p
            style={{
              marginTop: 32,
              fontSize: 12,
              color: "var(--muted-soft)",
              lineHeight: 1.6,
            }}
          >
            {siteConfig.disclaimer}
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .header-nav-desktop { display: none !important; }
          .header-hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .header-mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
