"use client";

import { DatePicker, DateRangePicker, type DateRange } from "@shadcn-calendar/registry";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo, useState } from "react";

function formatDate(date: Date | null) {
  return date ? format(date, "PPP") : "None";
}

function formatRange(range: DateRange | null) {
  if (!range?.from && !range?.to) {
    return "None";
  }

  if (range?.from && range.to) {
    return `${formatDate(range.from)} -> ${formatDate(range.to)}`;
  }

  return `${formatDate(range?.from ?? null)} -> ...`;
}

export function CalendarDemo() {
  const [singleValue, setSingleValue] = useState<Date | null>(new Date());
  const [rangeApplyValue, setRangeApplyValue] = useState<DateRange | null>(null);
  const [rangeAutoValue, setRangeAutoValue] = useState<DateRange | null>(null);
  const [rangeLocalizedValue, setRangeLocalizedValue] = useState<DateRange | null>(null);
  const [rangeAutoCommitCount, setRangeAutoCommitCount] = useState(0);

  const singleSummary = useMemo(() => formatDate(singleValue), [singleValue]);
  const rangeApplySummary = useMemo(() => formatRange(rangeApplyValue), [rangeApplyValue]);
  const rangeAutoSummary = useMemo(() => formatRange(rangeAutoValue), [rangeAutoValue]);
  const rangeLocalizedSummary = useMemo(() => formatRange(rangeLocalizedValue), [rangeLocalizedValue]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Single Date Picker</h2>
        <DatePicker value={singleValue} onValueChange={setSingleValue} />
        <p className="mt-4 text-sm text-slate-600">
          Committed value: <span className="font-medium text-slate-900">{singleSummary}</span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Range Picker (Apply flow)</h2>
        <DateRangePicker value={rangeApplyValue} onValueChange={setRangeApplyValue} autoApply={false} />
        <p className="mt-4 text-sm text-slate-600">
          Committed value: <span className="font-medium text-slate-900">{rangeApplySummary}</span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold">Range Picker (autoApply=true)</h2>
        <DateRangePicker
          value={rangeAutoValue}
          autoApply
          onValueChange={(nextValue: DateRange | null) => {
            setRangeAutoValue(nextValue);
            setRangeAutoCommitCount((count) => count + 1);
          }}
        />
        <p className="mt-4 text-sm text-slate-600">
          Committed value: <span className="font-medium text-slate-900">{rangeAutoSummary}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Commit count: {rangeAutoCommitCount}. First click selects only `from`; commit happens after `to` is selected.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold">Localized Range Picker (labels + locale)</h2>
        <DateRangePicker
          value={rangeLocalizedValue}
          onValueChange={setRangeLocalizedValue}
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
        <p className="mt-4 text-sm text-slate-600">
          Committed value: <span className="font-medium text-slate-900">{rangeLocalizedSummary}</span>
        </p>
      </section>
    </div>
  );
}
