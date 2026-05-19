export default function ProcedureLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="h-8 w-56 rounded-md bg-line" />
          <div className="mt-4 h-32 rounded-md bg-line" />
          <div className="mt-8 h-64 rounded-md bg-line" />
        </div>
        <div className="h-96 rounded-md bg-line" />
      </div>
    </div>
  );
}
