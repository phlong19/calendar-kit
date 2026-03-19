"use client";

import {
  getBuiltInPresets,
  isCompleteRange,
  normalizeRange,
  DEFAULT_CUSTOM_PRESET_STORAGE_KEY,
  loadCustomPresets,
  saveCustomPresets
} from "@shadcn-calendar/core";
import type { Locale } from "date-fns";
import { format, isSameDay, isSameMonth, startOfMonth } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { DateRange, DateRangePickerProps, RangePreset } from "../../types";
import { resolvePickerLabels } from "../../lib/picker-labels";
import { useControllableState } from "../../lib/use-controllable-state";
import { LinkedCalendars } from "./linked-calendars";
import { PickerFooter } from "./picker-footer";
import { PresetsPanel } from "./presets-panel";
import { RangeInputDisplay } from "./range-input-display";

function formatRangeValue(
  range: DateRange | null | undefined,
  displayFormat: string,
  locale?: Locale
) {
  if (!range?.from && !range?.to) {
    return "";
  }

  if (range?.from && range.to) {
    return `${format(range.from, displayFormat, { locale })} - ${format(range.to, displayFormat, { locale })}`;
  }

  if (range?.from) {
    return `${format(range.from, displayFormat, { locale })} -`;
  }

  return "";
}

function areRangesEqual(left: DateRange | null | undefined, right: DateRange | null | undefined) {
  if (!left?.from && !left?.to && !right?.from && !right?.to) {
    return true;
  }

  if (!left?.from || !left?.to || !right?.from || !right?.to) {
    return false;
  }

  return isSameDay(left.from, right.from) && isSameDay(left.to, right.to);
}

function normalizePreset(preset: RangePreset): RangePreset | null {
  const normalized = normalizeRange(preset.value);

  if (!normalized?.from || !normalized.to) {
    return null;
  }

  return {
    id: preset.id,
    label: preset.label,
    value: normalized
  };
}

export function DateRangePicker({
  value,
  defaultValue = null,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  autoApply = false,
  fromYear,
  toYear,
  displayFormat = "MMM d, yyyy",
  locale,
  labels,
  numberOfMonths = 2,
  presets,
  enableCustomPresets = true,
  customPresetStorageKey = DEFAULT_CUSTOM_PRESET_STORAGE_KEY
}: Readonly<DateRangePickerProps>) {
  const t = useMemo(() => resolvePickerLabels(labels), [labels]);

  const normalizedValue = useMemo(
    () => (value === undefined ? undefined : normalizeRange(value)),
    [value === undefined, value === null, value?.from?.getTime(), value?.to?.getTime()]
  );

  const normalizedDefaultValue = useMemo(
    () => normalizeRange(defaultValue),
    [defaultValue === null, defaultValue?.from?.getTime(), defaultValue?.to?.getTime()]
  );

  const [committedRange, setCommittedRange] = useControllableState<DateRange | null>({
    value: normalizedValue,
    defaultValue: normalizedDefaultValue,
    onChange: onValueChange
  });

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange
  });

  const initialMonth = startOfMonth(normalizedValue?.from ?? normalizedDefaultValue?.from ?? new Date());
  const [baseMonth, setBaseMonth] = useState<Date>(initialMonth);
  const [draftRange, setDraftRange] = useState<DateRange | null>(normalizeRange(committedRange));
  const [customPresets, setCustomPresets] = useState<RangePreset[]>([]);
  const [customPresetLabel, setCustomPresetLabel] = useState("");

  const currentYear = new Date().getFullYear();
  const startYear = fromYear ?? currentYear - 10;
  const endYear = toYear ?? currentYear + 10;
  const calendarCount = Math.max(1, numberOfMonths);

  useEffect(() => {
    if (!enableCustomPresets) {
      setCustomPresets([]);
      return;
    }

    setCustomPresets(loadCustomPresets(customPresetStorageKey));
  }, [customPresetStorageKey, enableCustomPresets]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    const normalizedCommitted = normalizeRange(committedRange);
    const nextBaseMonth = startOfMonth(normalizedCommitted?.from ?? new Date());

    setDraftRange((prevRange) =>
      areRangesEqual(prevRange, normalizedCommitted) ? prevRange : normalizedCommitted
    );
    setBaseMonth((prevMonth) =>
      isSameMonth(prevMonth, nextBaseMonth) ? prevMonth : nextBaseMonth
    );
  }, [committedRange, isOpen]);

  const builtInPresets = useMemo(
    () => getBuiltInPresets(new Date(), t.presets, locale),
    [locale, t.presets]
  );
  const normalizedProvidedPresets = useMemo(
    () => (presets ?? []).map((preset) => normalizePreset(preset)).filter((preset): preset is RangePreset => Boolean(preset)),
    [presets]
  );

  const allPresets = useMemo(
    () => [...builtInPresets, ...normalizedProvidedPresets, ...customPresets],
    [builtInPresets, customPresets, normalizedProvidedPresets]
  );

  const commitRange = useCallback(
    (nextRange: DateRange | null) => {
      const normalized = normalizeRange(nextRange);
      setCommittedRange(normalized);
      setDraftRange(normalized);
      setIsOpen(false);
    },
    [setCommittedRange, setIsOpen]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setDraftRange(normalizeRange(committedRange));
        setBaseMonth(startOfMonth(committedRange?.from ?? new Date()));
      } else {
        setDraftRange(normalizeRange(committedRange));
      }

      setIsOpen(nextOpen);
    },
    [committedRange, setIsOpen]
  );

  const handleDraftRangeChange = useCallback(
    (nextRange: DateRange | null) => {
      const normalized = normalizeRange(nextRange);
      setDraftRange(normalized);

      if (autoApply && isCompleteRange(normalized)) {
        commitRange(normalized);
      }
    },
    [autoApply, commitRange]
  );

  const handlePresetSelect = useCallback(
    (preset: RangePreset) => {
      const normalized = normalizeRange(preset.value);
      setDraftRange(normalized);
      if (normalized?.from) {
        setBaseMonth(startOfMonth(normalized.from));
      }

      if (autoApply && isCompleteRange(normalized)) {
        commitRange(normalized);
      }
    },
    [autoApply, commitRange]
  );

  const handleSaveCustomPreset = useCallback(() => {
    if (!enableCustomPresets || !isCompleteRange(draftRange)) {
      return;
    }

    const label = customPresetLabel.trim();

    if (!label) {
      return;
    }

    const nextPreset: RangePreset = {
      id: `custom-${Date.now()}`,
      label,
      value: {
        from: draftRange.from,
        to: draftRange.to
      }
    };

    setCustomPresets((prevPresets) => {
      const nextPresets = [...prevPresets, nextPreset];
      saveCustomPresets(customPresetStorageKey, nextPresets);
      return nextPresets;
    });

    setCustomPresetLabel("");
  }, [customPresetLabel, customPresetStorageKey, draftRange, enableCustomPresets]);

  const displayValue = useMemo(
    () => formatRangeValue(committedRange, displayFormat, locale),
    [committedRange, displayFormat, locale]
  );
  const draftPreview = useMemo(
    () => formatRangeValue(draftRange, displayFormat, locale),
    [displayFormat, draftRange, locale]
  );

  return (
    <RangeInputDisplay
      open={isOpen}
      onOpenChange={handleOpenChange}
      displayValue={displayValue}
      placeholder={t.rangePlaceholder}
    >
      <div
        className="flex flex-row items-stretch"
      >
        <PresetsPanel
          presets={allPresets}
          draftRange={draftRange}
          customPresetLabel={customPresetLabel}
          enableCustomPresets={enableCustomPresets}
          labels={t}
          onPresetSelect={handlePresetSelect}
          onCustomPresetLabelChange={setCustomPresetLabel}
          onSaveCustomPreset={handleSaveCustomPreset}
        />

        <div className="flex flex-col self-start">
          <LinkedCalendars
            baseMonth={baseMonth}
            count={calendarCount}
            draftRange={draftRange}
            fromYear={startYear}
            toYear={endYear}
            locale={locale}
            labels={t}
            onBaseMonthChange={setBaseMonth}
            onDraftRangeChange={handleDraftRangeChange}
          />

          {autoApply ? null : (
            <PickerFooter
              draftPreview={draftPreview}
              canApply={isCompleteRange(draftRange)}
              labels={t}
              onClear={() => commitRange(null)}
              onApply={() => commitRange(draftRange)}
            />
          )}
        </div>
      </div>
    </RangeInputDisplay>
  );
}
