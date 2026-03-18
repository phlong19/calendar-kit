"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface PickerPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayValue: string;
  placeholder: string;
  children: ReactNode;
}

export function PickerPopover({
  open,
  onOpenChange,
  displayValue,
  placeholder,
  children
}: Readonly<PickerPopoverProps>) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button type="button" className="calendar-kit-theme w-full text-left">
          <Input
            readOnly
            value={displayValue}
            placeholder={placeholder}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn("h-10 w-full cursor-pointer bg-background")}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="calendar-kit-theme min-w-max border border-border bg-popover text-popover-foreground shadow-lg p-0"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
