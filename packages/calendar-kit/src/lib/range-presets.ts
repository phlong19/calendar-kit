import {
  endOfMonth,
  endOfWeek,
  isAfter,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks
} from "date-fns";

import type {
  BuiltInPresetId,
  BuiltInPresetLabels,
  DateRange,
  RangePreset
} from "../types";

export const DEFAULT_CUSTOM_PRESET_STORAGE_KEY = "calendar-kit:custom-range-presets:v1";
export interface CompleteDateRange {
  from: Date;
  to: Date;
}

interface PersistedCustomPreset {
  id: string;
  label: string;
  fromISO: string;
  toISO: string;
}

interface PersistedCustomPresetPayload {
  version: 1;
  presets: PersistedCustomPreset[];
}

export function normalizeRange(range: DateRange | null | undefined): DateRange | null {
  if (!range) {
    return null;
  }

  const from = range.from ? startOfDay(range.from) : null;
  const to = range.to ? startOfDay(range.to) : null;

  if (from && to && isAfter(from, to)) {
    return { from: to, to: from };
  }

  return { from, to };
}

export function isCompleteRange(
  range: DateRange | null | undefined
): range is CompleteDateRange {
  return Boolean(range?.from && range.to);
}

function getBuiltInPresetLabel(
  id: BuiltInPresetId,
  labels?: BuiltInPresetLabels
) {
  const defaultLabels: Record<BuiltInPresetId, string> = {
    today: "Today",
    yesterday: "Yesterday",
    "this-week": "This week",
    "last-week": "Last week",
    "this-month": "This month",
    "last-month": "Last month",
    "last-3-months": "Last 3 months",
    "last-6-months": "Last 6 months"
  };

  return labels?.[id] ?? defaultLabels[id];
}

export function getBuiltInPresets(
  referenceDate = new Date(),
  labels?: BuiltInPresetLabels
): RangePreset[] {
  const today = startOfDay(referenceDate);
  const yesterday = subDays(today, 1);

  return [
    {
      id: "today",
      label: getBuiltInPresetLabel("today", labels),
      value: { from: today, to: today }
    },
    {
      id: "yesterday",
      label: getBuiltInPresetLabel("yesterday", labels),
      value: { from: yesterday, to: yesterday }
    },
    {
      id: "this-week",
      label: getBuiltInPresetLabel("this-week", labels),
      value: { from: startOfWeek(today), to: endOfWeek(today) }
    },
    {
      id: "last-week",
      label: getBuiltInPresetLabel("last-week", labels),
      value: {
        from: startOfWeek(subWeeks(today, 1)),
        to: endOfWeek(subWeeks(today, 1))
      }
    },
    {
      id: "this-month",
      label: getBuiltInPresetLabel("this-month", labels),
      value: { from: startOfMonth(today), to: endOfMonth(today) }
    },
    {
      id: "last-month",
      label: getBuiltInPresetLabel("last-month", labels),
      value: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1))
      }
    },
    {
      id: "last-3-months",
      label: getBuiltInPresetLabel("last-3-months", labels),
      value: {
        from: startOfMonth(subMonths(today, 2)),
        to: today
      }
    },
    {
      id: "last-6-months",
      label: getBuiltInPresetLabel("last-6-months", labels),
      value: {
        from: startOfMonth(subMonths(today, 5)),
        to: today
      }
    }
  ];
}

function toPersistedPreset(preset: RangePreset): PersistedCustomPreset | null {
  if (!isCompleteRange(preset.value)) {
    return null;
  }

  return {
    id: preset.id,
    label: preset.label,
    fromISO: preset.value.from.toISOString(),
    toISO: preset.value.to.toISOString()
  };
}

export function loadCustomPresets(storageKey: string): RangePreset[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return [];
  }

  try {
    const payload = JSON.parse(raw) as PersistedCustomPresetPayload;

    if (payload.version !== 1 || !Array.isArray(payload.presets)) {
      return [];
    }

    return payload.presets
      .map((preset) => {
        const from = new Date(preset.fromISO);
        const to = new Date(preset.toISO);

        if (Number.isNaN(from.valueOf()) || Number.isNaN(to.valueOf())) {
          return null;
        }

        return {
          id: preset.id,
          label: preset.label,
          value: normalizeRange({ from, to })
        };
      })
      .filter((preset): preset is RangePreset => Boolean(preset?.value));
  } catch {
    return [];
  }
}

export function saveCustomPresets(storageKey: string, presets: RangePreset[]) {
  if (typeof window === "undefined") {
    return;
  }

  const serializedPresets = presets
    .map((preset) => toPersistedPreset(preset))
    .filter((preset): preset is PersistedCustomPreset => Boolean(preset));

  const payload: PersistedCustomPresetPayload = {
    version: 1,
    presets: serializedPresets
  };

  window.localStorage.setItem(storageKey, JSON.stringify(payload));
}
