import {
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks
} from "date-fns";
import type { Locale } from "date-fns";

import type { BuiltInPresetId, BuiltInPresetLabels, RangePreset } from "../types";

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
  labels?: BuiltInPresetLabels,
  locale?: Locale
): RangePreset[] {
  const today = startOfDay(referenceDate);
  const yesterday = subDays(today, 1);
  const weekStartsOn = locale?.options?.weekStartsOn;

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
      value: {
        from: startOfWeek(today, { locale, weekStartsOn }),
        to: endOfWeek(today, { locale, weekStartsOn })
      }
    },
    {
      id: "last-week",
      label: getBuiltInPresetLabel("last-week", labels),
      value: {
        from: startOfWeek(subWeeks(today, 1), { locale, weekStartsOn }),
        to: endOfWeek(subWeeks(today, 1), { locale, weekStartsOn })
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
