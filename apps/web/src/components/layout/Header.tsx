import type { Route } from "next";
import Link from "next/link";

import { navItems, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Accueil DossierBJ">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-base font-bold text-white">
            DBJ
          </span>
          <span>
            <span className="block text-base font-bold">{siteConfig.name}</span>
            <span className="block text-xs text-muted">CivicRAG en mode mock</span>
          </span>
        </Link>
        <nav
          className="flex gap-2 overflow-x-auto pb-1 text-sm text-muted lg:pb-0"
          aria-label="Navigation principale"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="rounded-md px-3 py-2 hover:bg-background hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
