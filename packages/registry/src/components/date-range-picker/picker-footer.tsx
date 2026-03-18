"use client";

import type { ResolvedPickerLabels } from "../../lib/picker-labels";
import { Button } from "../ui/button";

interface PickerFooterProps {
  draftPreview: string;
  canApply: boolean;
  labels: ResolvedPickerLabels;
  onClear: () => void;
  onApply: () => void;
}

export function PickerFooter({
  draftPreview,
  canApply,
  labels,
  onClear,
  onApply,
}: Readonly<PickerFooterProps>) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border p-3">
      <p className="text-sm text-muted-foreground">
        {draftPreview || labels.draftRangePlaceholder}
      </p>
      <div className="flex flex-row gap-3 items-center">
        <Button type="button" variant="ghost" className="h-9 rounded-sm" onClick={onClear}>
          {labels.clear}
        </Button>

        <Button
          type="button"
          disabled={!canApply}
          className="h-9 rounded-sm"
          onClick={onApply}
        >
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}
