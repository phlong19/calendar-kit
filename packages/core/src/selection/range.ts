import { isAfter, startOfDay } from "date-fns";

import type { CompleteDateRange, DateRange, RangePreset } from "../types";

export const DEFAULT_CUSTOM_PRESET_STORAGE_KEY = "calendar-kit:custom-range-presets:v1";

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
  if (globalThis.window === undefined) {
    return [];
  }

  const raw = globalThis.localStorage.getItem(storageKey);

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
  if (globalThis.window === undefined) {
    return;
  }

  const serializedPresets = presets
    .map((preset) => toPersistedPreset(preset))
    .filter((preset): preset is PersistedCustomPreset => Boolean(preset));

  const payload: PersistedCustomPresetPayload = {
    version: 1,
    presets: serializedPresets
  };

  globalThis.localStorage.setItem(storageKey, JSON.stringify(payload));
}
