"use client";

import { cn } from "../../lib/utils";
import type { DateRange, RangePreset } from "../../types";
import { isCompleteRange } from "@calendar-kit/core";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface PresetsPanelProps {
  presets: RangePreset[];
  draftRange: DateRange | null;
  customPresetLabel: string;
  enableCustomPresets: boolean;
  onPresetSelect: (preset: RangePreset) => void;
  onCustomPresetLabelChange: (label: string) => void;
  onSaveCustomPreset: () => void;
}

function isRangeMatch(left: DateRange | null | undefined, right: DateRange | null | undefined) {
  if (!left?.from || !left.to || !right?.from || !right.to) {
    return false;
  }

  return left.from.getTime() === right.from.getTime() && left.to.getTime() === right.to.getTime();
}

export function PresetsPanel({
  presets,
  draftRange,
  customPresetLabel,
  enableCustomPresets,
  onPresetSelect,
  onCustomPresetLabelChange,
  onSaveCustomPreset
}: Readonly<PresetsPanelProps>) {
  return (
    <Card className="w-52 ring-0 bg-muted/30 border-r border-border pr-3 rounded-none p-0">
      <ScrollArea className="flex-1 pr-1">
        <div className="space-y-1">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              className={cn(
                "w-full justify-start text-left",
                isRangeMatch(draftRange, preset.value) && "bg-primary text-primary-foreground"
              )}
              size="sm"
              variant={isRangeMatch(draftRange, preset.value) ? "secondary" : "ghost"}
              onClick={() => onPresetSelect(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {enableCustomPresets ? (
        <div className="flex items-center gap-2">
          <Input
            id="custom-preset-label"
            value={customPresetLabel}
            placeholder="Custom range"
            className="h-8 bg-background"
            onChange={(event) => onCustomPresetLabelChange(event.currentTarget.value)}
          />
          <Button
            type="button"
            disabled={!isCompleteRange(draftRange) || !customPresetLabel.trim()}
            size="sm"
            variant="outline"
            className="h-8 px-2 text-xs rounded-md"
            onClick={onSaveCustomPreset}
          >
            Save
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
