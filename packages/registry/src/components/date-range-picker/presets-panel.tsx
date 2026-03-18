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
    <Card
      id="presets-panel-container-card"
      className="w-52 shrink-0 rounded-none border-r border-border bg-muted/30 p-3 ring-0 gap-0"
    >
      <ScrollArea
        type="always"
        data-testid="presets-scroll-area"
        data-scrollbar-visibility="always"
        className="ck-presets-scroll h-75 pr-2"
      >
        <div className="space-y-1">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              className={cn(
                "w-full justify-start text-left cursor-pointer rounded-sm",
                isRangeMatch(draftRange, preset.value) && "bg-primary text-primary-foreground hover:bg-primary/80"
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
        <div className="flex items-center gap-1.5 pt-3">
          <Input
            id="custom-preset-label"
            value={customPresetLabel}
            placeholder="Custom range"
            className="h-8 bg-background rounded-sm"
            onChange={(event) => onCustomPresetLabelChange(event.currentTarget.value)}
          />
          <Button
            type="button"
            disabled={!isCompleteRange(draftRange) || !customPresetLabel.trim()}
            size="sm"
            variant="outline"
            className="h-8 px-2 text-xs rounded-sm shadow-none cursor-pointer"
            onClick={onSaveCustomPreset}
          >
            Save
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
