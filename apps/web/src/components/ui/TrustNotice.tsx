import { siteConfig } from "@/lib/site";

export function TrustNotice({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className="rounded-md border border-accent/40 bg-[#fff8e8] p-4 text-sm text-[#5d4318]"
      aria-label="Avertissement non officiel"
    >
      <p className={compact ? "" : "leading-6"}>
        <strong>Important : </strong>
        {siteConfig.disclaimer}
      </p>
    </section>
  );
}
