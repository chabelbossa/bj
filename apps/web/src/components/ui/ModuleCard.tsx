export function ModuleCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <article className="rounded-md border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold">{title}</h3>
        <span className="rounded-sm bg-[#e6f2ec] px-2 py-1 text-xs font-medium text-brand-strong">
          {status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
