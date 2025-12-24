import { format, parse, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";

// Using "MMMM yyyy" format as per user preference (e.g., "May 2024")
export function getMonthTabName(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function getMonthDisplayName(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function parseMonthTabName(tabName: string): Date {
  return parse(tabName, "MMMM yyyy", new Date());
}

export function getMonthFromTabName(tabName: string): { start: Date; end: Date } {
  const date = parseMonthTabName(tabName);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

export function getCurrentMonthTab(): string {
  return getMonthTabName(new Date());
}

export function getNextMonth(tabName: string): string {
  const date = parseMonthTabName(tabName);
  return getMonthTabName(addMonths(date, 1));
}

export function getPreviousMonth(tabName: string): string {
  const date = parseMonthTabName(tabName);
  return getMonthTabName(subMonths(date, 1));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d");
}
