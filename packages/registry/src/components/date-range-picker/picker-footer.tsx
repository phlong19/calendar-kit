"use client";

import { Button } from "../ui/button";

interface PickerFooterProps {
  draftPreview: string;
  canApply: boolean;
  onClear: () => void;
  onApply: () => void;
}

export function PickerFooter({
  draftPreview,
  canApply,
  onClear,
  onApply
}: Readonly<PickerFooterProps>) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
      <p className="text-sm text-muted-foreground">
        {draftPreview || "Select a start and end date"}
      </p>
      <Button type="button" variant="ghost" className="h-9" onClick={onClear}>
        Clear
      </Button>

      <Button type="button" disabled={!canApply} className="h-9" onClick={onApply}>
        Apply
      </Button>
    </div>
  );
}
