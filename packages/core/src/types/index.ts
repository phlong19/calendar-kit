export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface RangePreset {
  id: string;
  label: string;
  value: DateRange;
}

export type BuiltInPresetId =
  | "today"
  | "yesterday"
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "last-6-months";

export type BuiltInPresetLabels = Partial<Record<BuiltInPresetId, string>>;

export interface CompleteDateRange {
  from: Date;
  to: Date;
}
