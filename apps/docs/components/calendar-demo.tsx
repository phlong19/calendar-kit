"use client";

import { Calendar, type DateRange, RangeCalendar } from "calendar-kit";
import { format } from "date-fns";
import { useMemo, useState } from "react";

function formatDate(date: Date | null) {
  return date ? format(date, "PPP") : "None";
}

function formatRange(range: DateRange | null) {
  if (!range?.from && !range?.to) {
    return "None";
  }

  return `${formatDate(range.from)} -> ${formatDate(range.to)}`;
}

export function CalendarDemo() {
  const [singleValue, setSingleValue] = useState<Date | null>(new Date());
  const [rangeValue, setRangeValue] = useState<DateRange | null>({
    from: new Date(),
    to: null
  });

  const singleSummary = useMemo(() => formatDate(singleValue), [singleValue]);
  const rangeSummary = useMemo(() => formatRange(rangeValue), [rangeValue]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Single Date</h2>
        <Calendar value={singleValue} onValueChange={setSingleValue} />
        <p className="mt-4 text-sm text-slate-600">
          Selected: <span className="font-medium text-slate-900">{singleSummary}</span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Date Range</h2>
        <RangeCalendar value={rangeValue} onValueChange={setRangeValue} />
        <p className="mt-4 text-sm text-slate-600">
          Selected: <span className="font-medium text-slate-900">{rangeSummary}</span>
        </p>
      </section>
    </div>
  );
}
