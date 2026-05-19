import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto]">
        <p>{siteConfig.disclaimer}</p>
        <p>Mode local : données demo, IA mock, sans API payante.</p>
      </div>
    </footer>
  );
}
