import type { ProcedureSearchResult } from "@dossierbj/core";

import { ProcedureCard } from "./ProcedureCard";

export function ProcedureResultCard({ result }: { result: ProcedureSearchResult }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <ProcedureCard procedure={result.procedure} />
      {(result.reason || result.matchedFields.length > 0) && (
        <div
          style={{
            background: "var(--surface-soft)",
            border: "1px solid var(--hairline-soft)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
          }}
        >
          {result.reason && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                lineHeight: 1.5,
                color: "var(--muted)",
                margin: 0,
              }}
            >
              {result.reason}
            </p>
          )}
          {result.matchedFields.length > 0 ? (
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {result.matchedFields.slice(0, 4).map((field) => (
                <span
                  key={field}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--surface-cream-strong)",
                    color: "var(--muted)",
                  }}
                >
                  {field}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
