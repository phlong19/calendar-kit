"use client";

import {
  DatePicker,
  DateRangePicker,
  type DateRange,
  type PickerLabels,
  type RangePreset
} from "@shadcn-calendar/registry";
import { format, startOfDay, subDays } from "date-fns";
import { de, enUS, es, fr, ja, vi, zhCN } from "date-fns/locale";
import type { Locale } from "date-fns";
import { useMemo, useState } from "react";

type PlaygroundTab = "ui" | "code";
type PickerMode = "range" | "single";
type LocaleKey = "enUS" | "vi" | "fr" | "ja" | "de" | "es" | "zhCN";
type LabelSet = "en" | "vi";

const DEFAULT_STORAGE_KEY = "shadcn-calendar:custom-range-presets:v1";

const LOCALES: Record<LocaleKey, { locale: Locale; importName: string }> = {
  enUS: { locale: enUS, importName: "enUS" },
  vi: { locale: vi, importName: "vi" },
  fr: { locale: fr, importName: "fr" },
  ja: { locale: ja, importName: "ja" },
  de: { locale: de, importName: "de" },
  es: { locale: es, importName: "es" },
  zhCN: { locale: zhCN, importName: "zhCN" }
};

const LABELS_BY_SET: Record<LabelSet, PickerLabels> = {
  en: {
    datePlaceholder: "Select date",
    rangePlaceholder: "Select date range",
    customPresetPlaceholder: "Custom range name",
    draftRangePlaceholder: "Select a start and end date",
    apply: "Apply",
    clear: "Clear",
    save: "Save",
    presets: {
      today: "Today",
      yesterday: "Yesterday",
      "this-week": "This week",
      "last-week": "Last week"
    }
  },
  vi: {
    datePlaceholder: "Chọn ngày",
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
  }
};

function formatSingleValue(value: Date | null, locale: Locale) {
  return value ? format(value, "PPP", { locale }) : "None";
}

function formatRangeValue(value: DateRange | null, locale: Locale) {
  if (!value?.from && !value?.to) {
    return "None";
  }

  if (value?.from && value.to) {
    return `${format(value.from, "PPP", { locale })} -> ${format(value.to, "PPP", { locale })}`;
  }

  return `${value?.from ? format(value.from, "PPP", { locale }) : "None"} -> ...`;
}

export function PlaygroundTabs() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("ui");
  const [pickerMode, setPickerMode] = useState<PickerMode>("range");
  const [singleValue, setSingleValue] = useState<Date | null>(null);
  const [rangeValue, setRangeValue] = useState<DateRange | null>(null);
  const [copied, setCopied] = useState(false);

  const [autoApply, setAutoApply] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const [fromYear, setFromYear] = useState(new Date().getFullYear() - 10);
  const [toYear, setToYear] = useState(new Date().getFullYear() + 10);
  const [displayFormat, setDisplayFormat] = useState("MMM d, yyyy");
  const [enableCustomPresets, setEnableCustomPresets] = useState(true);
  const [customPresetStorageKey, setCustomPresetStorageKey] = useState(DEFAULT_STORAGE_KEY);
  const [includeSamplePresets, setIncludeSamplePresets] = useState(false);
  const [localeKey, setLocaleKey] = useState<LocaleKey>("vi");
  const [labelSet, setLabelSet] = useState<LabelSet>("vi");

  const locale = LOCALES[localeKey].locale;
  const labels = LABELS_BY_SET[labelSet];

  const samplePresets = useMemo<RangePreset[]>(
    () => [
      {
        id: "last-7-days",
        label: labelSet === "vi" ? "7 ngày gần đây" : "Last 7 days",
        value: {
          from: subDays(startOfDay(new Date()), 6),
          to: startOfDay(new Date())
        }
      },
      {
        id: "last-30-days",
        label: labelSet === "vi" ? "30 ngày gần đây" : "Last 30 days",
        value: {
          from: subDays(startOfDay(new Date()), 29),
          to: startOfDay(new Date())
        }
      }
    ],
    [labelSet]
  );

  const preview = useMemo(
    () =>
      pickerMode === "single"
        ? formatSingleValue(singleValue, locale)
        : formatRangeValue(rangeValue, locale),
    [locale, pickerMode, rangeValue, singleValue]
  );

  const codeBlock = useMemo(() => {
    const localeImportName = LOCALES[localeKey].importName;
    const pickerImport =
      pickerMode === "single"
        ? 'import { DatePicker } from "@shadcn-calendar/registry"'
        : 'import { DateRangePicker, type DateRange } from "@shadcn-calendar/registry"';
    const valueState =
      pickerMode === "single"
        ? "const [value, setValue] = useState<Date | null>(null)"
        : "const [value, setValue] = useState<DateRange | null>(null)";
    const labelsBlock =
      labelSet === "vi"
        ? `
      labels={{
        datePlaceholder: "Chọn ngày",
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
      }}`
        : "";

    const rangeOnlyBlock =
      pickerMode === "range"
        ? `
      numberOfMonths={${numberOfMonths}}
      enableCustomPresets={${enableCustomPresets}}
      customPresetStorageKey="${customPresetStorageKey}"${
            includeSamplePresets
              ? `
      presets={[
        { id: "last-7-days", label: "Last 7 days", value: { from: new Date(), to: new Date() } }
      ]}`
              : ""
          }`
        : "";

    const componentName = pickerMode === "single" ? "DatePicker" : "DateRangePicker";

    return `import { useState } from "react"
${pickerImport}
import { ${localeImportName} } from "date-fns/locale"
import "@shadcn-calendar/registry/styles.css"

export function Example() {
  ${valueState}

  return (
    <${componentName}
      value={value}
      onValueChange={setValue}
      autoApply={${autoApply}}
      defaultOpen={${defaultOpen}}
      fromYear={${fromYear}}
      toYear={${toYear}}
      displayFormat="${displayFormat}"
      locale={${localeImportName}}${labelsBlock}${rangeOnlyBlock}
    />
  )
}`;
  }, [
    autoApply,
    customPresetStorageKey,
    defaultOpen,
    displayFormat,
    enableCustomPresets,
    fromYear,
    includeSamplePresets,
    labelSet,
    localeKey,
    numberOfMonths,
    pickerMode,
    toYear
  ]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeBlock);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Playground</h3>
        <div
          role="tablist"
          aria-label="Playground tabs"
          className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ui"}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              activeTab === "ui"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("ui")}
          >
            UI Playground
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "code"}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              activeTab === "code"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("code")}
          >
            View code
          </button>
        </div>
      </div>

      {activeTab === "ui" ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm text-slate-700">
              Picker mode
              <select
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                value={pickerMode}
                onChange={(event) => setPickerMode(event.currentTarget.value as PickerMode)}
              >
                <option value="range">Range picker</option>
                <option value="single">Single date picker</option>
              </select>
            </label>

            <label className="text-sm text-slate-700">
              Locale
              <select
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                value={localeKey}
                onChange={(event) => setLocaleKey(event.currentTarget.value as LocaleKey)}
              >
                <option value="vi">vi</option>
                <option value="enUS">enUS</option>
                <option value="fr">fr</option>
                <option value="ja">ja</option>
                <option value="de">de</option>
                <option value="es">es</option>
                <option value="zhCN">zhCN</option>
              </select>
            </label>

            <label className="text-sm text-slate-700">
              Labels
              <select
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                value={labelSet}
                onChange={(event) => setLabelSet(event.currentTarget.value as LabelSet)}
              >
                <option value="vi">Vietnamese labels</option>
                <option value="en">English labels</option>
              </select>
            </label>

            <label className="text-sm text-slate-700">
              <span className="flex items-center justify-between gap-2">
                <span>Display format</span>
                <a
                  href="https://date-fns.org/docs/format"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  date-fns format docs
                </a>
              </span>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                value={displayFormat}
                onChange={(event) => setDisplayFormat(event.currentTarget.value)}
              />
            </label>

            {pickerMode === "range" ? (
              <label className="text-sm text-slate-700">
                Number of months
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                  value={numberOfMonths}
                  onChange={(event) => setNumberOfMonths(Number(event.currentTarget.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </label>
            ) : null}

            <label className="text-sm text-slate-700">
              From year
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                value={fromYear}
                onChange={(event) => setFromYear(Number(event.currentTarget.value))}
              />
            </label>

            <label className="text-sm text-slate-700">
              To year
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                value={toYear}
                onChange={(event) => setToYear(Number(event.currentTarget.value))}
              />
            </label>
          </div>

          {pickerMode === "range" ? (
            <label className="block text-sm text-slate-700">
              Custom preset storage key
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
                value={customPresetStorageKey}
                onChange={(event) => setCustomPresetStorageKey(event.currentTarget.value)}
              />
            </label>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={autoApply}
                onChange={(event) => setAutoApply(event.currentTarget.checked)}
              />
              autoApply
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={defaultOpen}
                onChange={(event) => setDefaultOpen(event.currentTarget.checked)}
              />
              defaultOpen
            </label>

            {pickerMode === "range" ? (
              <>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={enableCustomPresets}
                    onChange={(event) => setEnableCustomPresets(event.currentTarget.checked)}
                  />
                  enableCustomPresets
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeSamplePresets}
                    onChange={(event) => setIncludeSamplePresets(event.currentTarget.checked)}
                  />
                  include sample presets
                </label>
              </>
            ) : null}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            {pickerMode === "single" ? (
              <DatePicker
                value={singleValue}
                onValueChange={setSingleValue}
                autoApply={autoApply}
                defaultOpen={defaultOpen}
                fromYear={fromYear}
                toYear={toYear}
                displayFormat={displayFormat}
                locale={locale}
                labels={labels}
              />
            ) : (
              <DateRangePicker
                value={rangeValue}
                onValueChange={setRangeValue}
                autoApply={autoApply}
                defaultOpen={defaultOpen}
                numberOfMonths={numberOfMonths}
                fromYear={fromYear}
                toYear={toYear}
                displayFormat={displayFormat}
                enableCustomPresets={enableCustomPresets}
                customPresetStorageKey={customPresetStorageKey}
                locale={locale}
                labels={labels}
                presets={includeSamplePresets ? samplePresets : undefined}
              />
            )}
            <p className="mt-3 text-sm text-slate-600">
              Committed value: <span className="font-medium text-slate-900">{preview}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              onClick={handleCopyCode}
            >
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
            {codeBlock}
          </pre>
        </div>
      )}
    </div>
  );
}
