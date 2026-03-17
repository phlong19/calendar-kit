"use client";

import type { ReactNode } from "react";

import { PickerPopover } from "../shared/picker-popover";

interface DatePickerInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayValue: string;
  placeholder: string;
  children: ReactNode;
}

export function DatePickerInput(props: Readonly<DatePickerInputProps>) {
  return <PickerPopover {...props} />;
}
