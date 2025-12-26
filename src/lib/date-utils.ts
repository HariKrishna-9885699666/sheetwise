import { format, parse, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";

// Using "MMMM yyyy" format as per user preference (e.g., "May 2024")
export function getMonthTabName(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function getMonthDisplayName(date: Date): string {
  // Validate date before formatting
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return format(date, "MMMM yyyy");
}

export function parseMonthTabName(tabName: string): Date {
  try {
    const date = parse(tabName, "MMMM yyyy", new Date());
    // Check if parsed date is valid
    if (isNaN(date.getTime())) {
      return new Date(); // Return current date as fallback
    }
    return date;
  } catch (error) {
    return new Date(); // Return current date as fallback
  }
}

// Check if a tab name is a valid month format
export function isValidMonthTab(tabName: string): boolean {
  try {
    const date = parse(tabName, "MMMM yyyy", new Date());
    return !isNaN(date.getTime()) && format(date, "MMMM yyyy") === tabName;
  } catch {
    return false;
  }
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
