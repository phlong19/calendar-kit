import { addMonths, startOfMonth, subMonths } from "date-fns";

export function getLinkedMonth(baseMonth: Date, index: number) {
  return addMonths(startOfMonth(baseMonth), index);
}

export function getLinkedBaseMonth(nextMonth: Date, index: number) {
  return startOfMonth(subMonths(nextMonth, index));
}
