export interface Transaction {
  id: string;
  date: string; // ISO date string
  expense: number | null;
  income: number | null;
  category: string;
  account: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface MonthTab {
  name: string; // e.g., "2024-05"
  displayName: string; // e.g., "May 2024"
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
] as const;

export const ACCOUNTS = [
  "Cash",
  "Bank Account",
  "Credit Card",
  "Savings",
  "UPI",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Account = (typeof ACCOUNTS)[number];
