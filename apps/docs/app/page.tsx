import { CalendarDemo } from "../components/calendar-demo";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">calendar-kit</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Single + Range React Calendar
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Open-source, shadcn-like calendar primitives with controlled and uncontrolled APIs.
          v1 is source-first with manual integration docs.
        </p>
      </header>

      <CalendarDemo />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Manual Integration (v1)</h2>
        <p className="mt-2 text-sm text-slate-600">
          Install dependencies and import components from the package workspace or source.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
{`pnpm add calendar-kit date-fns class-variance-authority clsx tailwind-merge`}
        </pre>
      </section>
    </main>
  );
}
