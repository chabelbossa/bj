import { formatVerificationStatus, type VerificationStatus } from "@dossierbj/core";

export function ProcedureStatusBadge({ status }: { status: VerificationStatus }) {
  const classNames: Record<VerificationStatus, string> = {
    verified: "bg-[#e6f2ec] text-brand-strong",
    partially_verified: "bg-[#fff8e8] text-[#5d4318]",
    pending_verification: "bg-background text-muted",
    demo_unverified: "bg-[#fff1d6] text-[#774d08]",
  };

  return (
    <span className={`rounded-sm px-2 py-1 text-xs font-semibold ${classNames[status]}`}>
      {formatVerificationStatus(status)}
    </span>
  );
}
