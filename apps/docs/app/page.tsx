import { CalendarDemo } from "../components/calendar-demo";
import { InstallationTabs } from "../components/installation-tabs";
import { PlaygroundTabs } from "../components/playground-tabs";

const sections = [
  { id: "installation", label: "Installation" },
  { id: "quick-use", label: "Quick use" },
  { id: "playground", label: "Playground" },
  { id: "examples", label: "Examples" },
  { id: "using-with-rhf", label: "Using with RHF" }
];

export default function HomePage() {
  return (
    <>
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.2),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-900 text-xs font-bold">
              SC
            </span>
            <span className="text-sm font-medium tracking-wide">shadcn-calendar docs</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            shadcn-style calendar, date picker, and date range picker for React and Next.js
          </h1>

          <p className="mt-5 max-w-3xl text-base text-slate-200 lg:text-lg">
            Build production-ready calendar UX with an open-code registry approach: single date
            picker, date range picker, linked months, presets, localization, and React Hook Form
            integration powered by date-fns.
          </p>

          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Keywords: shadcn date picker, shadcn date range picker, React calendar, date range
            selection, Next.js calendar components.
          </p>
        </div>
      </section>

      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Documentation
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Setup, playground, examples, and integration guides
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Learn installation paths, copy starter snippets, test API options in playground, and
            integrate with forms quickly.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Docs
              </p>
              <nav aria-label="Docs sections">
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <div className="space-y-10">
            <section
              id="installation"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">Installation</h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose the installation mode that fits your workflow.
              </p>
              <InstallationTabs />
            </section>

            <section
              id="quick-use"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">Quick use</h2>
              <p className="mt-2 text-sm text-slate-600">
                Copy-paste example with imports (localized range picker):
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                {`import { useState } from "react"
import { vi } from "date-fns/locale"
import { DateRangePicker, type DateRange } from "@shadcn-calendar/registry"
import "@shadcn-calendar/registry/styles.css"

export function Example() {
  const [value, setValue] = useState<DateRange | null>(null)

  return (
    <DateRangePicker
      value={value}
      onValueChange={setValue}
      autoApply={false}
      locale={vi}
      labels={{
        rangePlaceholder: "Chọn khoảng ngày",
        customPresetPlaceholder: "Đặt tên khoảng tùy chỉnh",
        draftRangePlaceholder: "Chọn ngày bắt đầu và kết thúc",
        apply: "Áp dụng",
        clear: "Xóa",
        save: "Lưu",
        presets: {
          today: "Hôm nay",
          yesterday: "Hôm qua",
          "this-week": "Tuần này",
          "last-week": "Tuần trước"
        }
      }}
    />
  )
}`}
              </pre>
            </section>

            <section id="playground" className="scroll-mt-24">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Playground
              </h2>
              <PlaygroundTabs />
            </section>

            <section
              id="examples"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Examples</h2>
              <CalendarDemo />
            </section>

            <section
              id="using-with-rhf"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">Using with RHF</h2>
              <p className="mt-2 text-sm text-slate-600">
                Use `Controller` because picker values are controlled objects (`Date` / `DateRange`)
                and `onValueChange` emits committed values.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
{`import { Controller, useForm } from "react-hook-form"
import { DatePicker, DateRangePicker, type DateRange } from "@shadcn-calendar/registry"
import "@shadcn-calendar/registry/styles.css"

type FormValues = {
  singleDate: Date | null
  reportRange: DateRange | null
}

export function RhfExample() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      singleDate: null,
      reportRange: null
    }
  })

  return (
    <form onSubmit={handleSubmit(console.log)} className="space-y-4">
      <Controller
        control={control}
        name="singleDate"
        render={({ field }) => (
          <DatePicker
            value={field.value}
            onValueChange={field.onChange}
            autoApply
          />
        )}
      />

      <Controller
        control={control}
        name="reportRange"
        render={({ field }) => (
          <DateRangePicker
            value={field.value}
            onValueChange={field.onChange}
            autoApply={false}
            numberOfMonths={2}
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  )
}`}
              </pre>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
