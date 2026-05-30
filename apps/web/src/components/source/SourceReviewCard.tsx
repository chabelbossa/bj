import { getManualIngestionReadiness, type SourceReviewItem } from "@dossierbj/core";
import type { Route } from "next";
import Link from "next/link";

import { SourceReviewStatusBadge, sourceReviewStatusLabels } from "./SourceReviewStatusBadge";

export function SourceReviewCard({ item }: { item: SourceReviewItem }) {
  const readiness = getManualIngestionReadiness(item);

  return (
    <article
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xl)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "var(--primary)",
              margin: "0 0 6px",
            }}
          >
            {item.module}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.4,
              color: "var(--ink)",
              margin: "0 0 4px",
            }}
          >
            {item.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--muted)",
              margin: 0,
            }}
          >
            {item.authority}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <SourceReviewStatusBadge status={item.status} />
          <SourceReviewStatusBadge status={item.status} priority={item.priority} />
        </div>
      </div>

      {/* Details */}
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <dt
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--muted-soft)",
              marginBottom: 4,
            }}
          >
            Statut
          </dt>
          <dd
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--body)",
              margin: 0,
            }}
          >
            {sourceReviewStatusLabels[item.status]}
          </dd>
        </div>
        <div>
          <dt
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--muted-soft)",
              marginBottom: 4,
            }}
          >
            Fiches liées
          </dt>
          <dd
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--body)",
              margin: 0,
            }}
          >
            {item.relatedProcedureSlugs.join(", ")}
          </dd>
        </div>
        <div>
          <dt
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--muted-soft)",
              marginBottom: 4,
            }}
          >
            Dernière revue
          </dt>
          <dd
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--body)",
              margin: 0,
            }}
          >
            {item.lastReviewedAt ?? "Non revue"}
          </dd>
        </div>
      </dl>

      {/* Actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <Link
          href={`/sources/${item.id}` as Route}
          className="hover-underline"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--primary)",
            textDecoration: "none",
          }}
        >
          Voir la revue
        </Link>
        <a
          href={item.candidateUrl}
          target="_blank"
          rel="noreferrer"
          className="hover-underline"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--primary)",
            textDecoration: "none",
          }}
        >
          Ouvrir la source candidate
        </a>
      </div>

      {/* Notes */}
      {item.notes.length > 0 && (
        <ul
          style={{
            listStyle: "disc",
            paddingLeft: 20,
            margin: "0 0 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {item.notes.map((note) => (
            <li
              key={note}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--muted)",
              }}
            >
              {note}
            </li>
          ))}
        </ul>
      )}

      {/* Checklist */}
      <div
        style={{
          background: "var(--canvas)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-md)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--ink)",
            margin: "0 0 12px",
          }}
        >
          Checklist revue locale
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {readiness.checklist.map((step) => (
            <li key={step.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "var(--radius-xs)",
                  background: step.done
                    ? "color-mix(in srgb, var(--success) 15%, var(--canvas))"
                    : "var(--surface-card)",
                  border: "1px solid var(--hairline)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  color: step.done
                    ? "color-mix(in srgb, var(--success) 70%, var(--ink))"
                    : "var(--muted-soft)",
                }}
              >
                {step.done ? "✓" : "·"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--muted)",
                }}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ul>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--primary)",
            margin: 0,
          }}
        >
          Prochaine action : {readiness.nextAction}
        </p>
      </div>
    </article>
  );
}
