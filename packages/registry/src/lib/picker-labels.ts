import type { BuiltInPresetId } from "@shadcn-calendar/core";

import type { PickerLabels } from "../types";

const DEFAULT_PRESET_LABELS: Record<BuiltInPresetId, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "this-week": "This week",
  "last-week": "Last week",
  "this-month": "This month",
  "last-month": "Last month",
  "last-3-months": "Last 3 months",
  "last-6-months": "Last 6 months"
};

export type ResolvedPickerLabels = {
  apply: string;
  clear: string;
  save: string;
  cancel: string;
  datePlaceholder: string;
  rangePlaceholder: string;
  customPresetPlaceholder: string;
  draftRangePlaceholder: string;
  monthSelectAria: string;
  yearSelectAria: string;
  prevMonthAria: string;
  nextMonthAria: string;
  calendarAriaLabel: string;
  presets: Record<BuiltInPresetId, string>;
};

const DEFAULT_PICKER_LABELS: ResolvedPickerLabels = {
  apply: "Apply",
  clear: "Clear",
  save: "Save",
  cancel: "Cancel",
  datePlaceholder: "Select date",
  rangePlaceholder: "Select date range",
  customPresetPlaceholder: "Custom range",
  draftRangePlaceholder: "Select a start and end date",
  monthSelectAria: "Month",
  yearSelectAria: "Year",
  prevMonthAria: "Previous month",
  nextMonthAria: "Next month",
  calendarAriaLabel: "Calendar",
  presets: DEFAULT_PRESET_LABELS
};

export function resolvePickerLabels(labels?: PickerLabels): ResolvedPickerLabels {
  return {
    ...DEFAULT_PICKER_LABELS,
    ...labels,
    presets: {
      ...DEFAULT_PRESET_LABELS,
      ...labels?.presets
    }
  };
}
