export function SearchBox({
  defaultValue = "",
  action = "/demarches",
}: {
  defaultValue?: string;
  action?: string;
}) {
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label className="sr-only" htmlFor="procedure-search">
        Rechercher une démarche
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          id="procedure-search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Rechercher une démarche, une pièce, un dossier..."
          className="input-text-lg"
          style={{ flex: 1, minWidth: 220 }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ minHeight: 48, padding: "12px 24px" }}
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
