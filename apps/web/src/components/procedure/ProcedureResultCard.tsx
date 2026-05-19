import type { ProcedureSearchResult } from "@dossierbj/core";

import { ProcedureCard } from "./ProcedureCard";

export function ProcedureResultCard({ result }: { result: ProcedureSearchResult }) {
  return (
    <div className="space-y-3">
      <ProcedureCard procedure={result.procedure} />
      <div className="rounded-md border border-line bg-surface px-4 py-3 text-sm text-muted">
        <p>{result.reason}</p>
        {result.matchedFields.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {result.matchedFields.slice(0, 4).map((field) => (
              <span key={field} className="rounded-sm bg-background px-2 py-1 text-xs">
                {field}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
