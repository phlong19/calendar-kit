"use client";

import type { ReactNode } from "react";

import { PickerPopover } from "../shared/picker-popover";

interface RangeInputDisplayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayValue: string;
  placeholder: string;
  children: ReactNode;
}

export function RangeInputDisplay(props: Readonly<RangeInputDisplayProps>) {
  return <PickerPopover {...props} />;
}
