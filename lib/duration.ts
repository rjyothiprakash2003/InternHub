import { addMonths, addWeeks } from "date-fns";

export type DurationDefinition = {
  key: string;
  label: string;
  unit: "WEEKS" | "MONTHS" | string;
  amount: number;
};

export function calculateEndDate(startDate: Date, duration: DurationDefinition): Date {
  if (Number.isNaN(startDate.getTime())) {
    throw new Error("Start date must be valid.");
  }
  if (duration.amount <= 0) {
    throw new Error("Duration amount must be positive.");
  }
  if (duration.unit === "WEEKS") {
    return addWeeks(startDate, duration.amount);
  }
  if (duration.unit === "MONTHS") {
    return addMonths(startDate, duration.amount);
  }
  throw new Error("Unsupported duration unit.");
}

export function datesMatchDuration(
  startDate: Date,
  endDate: Date,
  duration: DurationDefinition,
) {
  const expected = calculateEndDate(startDate, duration);
  return expected.toISOString().slice(0, 10) === endDate.toISOString().slice(0, 10);
}
