export function SearchBox({
  defaultValue = "",
  action = "/demarches",
}: {
  defaultValue?: string;
  action?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="procedure-search">
        Rechercher une démarche
      </label>
      <input
        id="procedure-search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Rechercher une démarche, une pièce, un dossier..."
        className="min-h-12 flex-1 rounded-md border border-line bg-surface px-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      <button
        type="submit"
        className="min-h-12 rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-strong"
      >
        Rechercher
      </button>
    </form>
  );
}
