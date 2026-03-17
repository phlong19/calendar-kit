"use client";

import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths
} from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { DateRange, DateRangePickerProps, RangePreset } from "../types";
import { useControllableState } from "../lib/use-controllable-state";
import {
  DEFAULT_CUSTOM_PRESET_STORAGE_KEY,
  getBuiltInPresets,
  isCompleteRange,
  loadCustomPresets,
  normalizeRange,
  saveCustomPresets
} from "../lib/range-presets";
import { cn } from "../lib/utils";
import { MonthYearControls } from "./month-year-controls";
import { PickerPopover } from "./picker-popover";
import { RangeCalendar } from "./range-calendar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

function formatRangeValue(range: DateRange | null | undefined, displayFormat: string) {
  if (!range?.from && !range?.to) {
    return "";
  }

  if (range?.from && range.to) {
    return `${format(range.from, displayFormat)} - ${format(range.to, displayFormat)}`;
  }

  if (range?.from) {
    return `${format(range.from, displayFormat)} -`;
  }

  return "";
}

function isRangeMatch(left: DateRange | null | undefined, right: DateRange | null | undefined) {
  if (!left?.from || !left.to || !right?.from || !right.to) {
    return false;
  }

  return isSameDay(left.from, right.from) && isSameDay(left.to, right.to);
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
  numberOfMonths = 2,
  presets,
  presetLabels,
  enableCustomPresets = true,
  customPresetStorageKey = DEFAULT_CUSTOM_PRESET_STORAGE_KEY
}: DateRangePickerProps) {
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
    () => getBuiltInPresets(new Date(), presetLabels),
    [presetLabels]
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
    () => formatRangeValue(committedRange, displayFormat),
    [committedRange, displayFormat]
  );
  const draftPreview = useMemo(
    () => formatRangeValue(draftRange, displayFormat),
    [displayFormat, draftRange]
  );

  return (
    <PickerPopover
      open={isOpen}
      onOpenChange={handleOpenChange}
      displayValue={displayValue}
      placeholder="Select date range"
    >
      <div
        className="flex gap-3"
        style={{ minWidth: `${220 + 304 * calendarCount}px` }}
      >
        <Card className="w-52 border border-border bg-muted/30 p-3">
          <ScrollArea className="max-h-72 pr-1">
            <div className="space-y-1">
            {allPresets.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                className={cn(
                  "w-full justify-start text-left",
                  isRangeMatch(draftRange, preset.value) && "bg-primary text-primary-foreground"
                )}
                size="sm"
                variant={isRangeMatch(draftRange, preset.value) ? "secondary" : "ghost"}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
            </div>
          </ScrollArea>

          {enableCustomPresets ? (
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-2">
              <Input
                id="custom-preset-label"
                value={customPresetLabel}
                placeholder="Custom range"
                className="h-8 bg-background"
                onChange={(event) => setCustomPresetLabel(event.currentTarget.value)}
              />
              <Button
                type="button"
                disabled={!isCompleteRange(draftRange) || !customPresetLabel.trim()}
                size="sm"
                variant="outline"
                className="h-8 px-2 text-xs"
                onClick={handleSaveCustomPreset}
              >
                Save
              </Button>
            </div>
          ) : null}
        </Card>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {Array.from({ length: calendarCount }, (_, index) => {
              const calendarMonth = addMonths(baseMonth, index);

              return (
                <Card key={index} className="border border-border bg-muted/30 p-3">
                  <MonthYearControls
                    month={calendarMonth}
                    fromYear={startYear}
                    toYear={endYear}
                    calendarLabel={`Calendar ${index + 1}`}
                    onMonthChange={(nextMonth) =>
                      setBaseMonth(startOfMonth(subMonths(nextMonth, index)))
                    }
                  />

                  <RangeCalendar
                    value={draftRange}
                    onValueChange={handleDraftRangeChange}
                    month={calendarMonth}
                    onMonthChange={(nextMonth) =>
                      setBaseMonth(startOfMonth(subMonths(nextMonth, index)))
                    }
                    classNames={{
                      container: "border-0 bg-transparent p-0 shadow-none text-foreground",
                      header: "hidden"
                    }}
                  />
                </Card>
              );
            })}
          </div>

          {!autoApply ? (
            <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
              <p className="text-sm text-muted-foreground">
                {draftPreview || "Select a start and end date"}
              </p>
              <Button
                type="button"
                variant="ghost"
                className="h-9"
                onClick={() => commitRange(null)}
              >
                Clear
              </Button>

              <Button
                type="button"
                disabled={!isCompleteRange(draftRange)}
                className="h-9"
                onClick={() => commitRange(draftRange)}
              >
                Apply
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </PickerPopover>
  );
}
