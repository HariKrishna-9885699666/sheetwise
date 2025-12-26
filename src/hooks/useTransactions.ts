import { useState, useMemo, useCallback, useEffect } from "react";
import { Transaction } from "@/types/transaction";
import { getMonthTabName, getCurrentMonthTab } from "@/lib/date-utils";
import * as sheetsApi from "@/lib/google-sheets";
import { deleteImageFromDrive } from "@/lib/google-drive";
import { toast } from "sonner";

// Generate a simple unique ID
function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Demo data for initial state (used when API fails)
const generateDemoData = (): Record<string, Transaction[]> => {
  const currentMonth = getCurrentMonthTab();
  const now = new Date();
  
  const demoTransactions: Transaction[] = [

    {
      id: generateId(),
      date: new Date(now.getFullYear(), now.getMonth(), 3).toISOString(),
      expense: 2500,
      category: "Food & Dining",
      account: "Credit Card",
      notes: "Grocery shopping at Big Bazaar",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    },
    {
      id: generateId(),
      date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
      expense: 1200,
      category: "Transportation",
      account: "UPI",
      notes: "Uber rides this week",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    },

    {
      id: generateId(),
      date: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
      expense: 3500,
      category: "Bills & Utilities",
      account: "Bank Account",
      notes: "Electricity and internet bill",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    },
    {
      id: generateId(),
      date: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
      expense: 8500,
      category: "Shopping",
      account: "Credit Card",
      notes: "New clothes from Myntra",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    },
  ];

  return {
    [currentMonth]: demoTransactions,
  };
};

// Convert SheetRow to Transaction
function sheetRowToTransaction(row: sheetsApi.SheetRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    expense: row.expense || null,
    category: row.category,
    account: row.account,
    notes: row.notes,
    image: row.image,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deleted: false,
  };
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>(generateDemoData);
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonthTab());
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalData, setUseLocalData] = useState(true); // Fallback to local when API not configured
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [gapiReady, setGapiReady] = useState(false);

  // Initialize Google API
  useEffect(() => {
    const initGoogleApi = async () => {
      if (!sheetsApi.isApiConfigured) {
        setUseLocalData(true);
        return;
      }

      try {
        await sheetsApi.initializeGapi();
        sheetsApi.initializeGis();
        setGapiReady(true);
        
        // Fetch user email if signed in
        if (sheetsApi.isSignedIn()) {
          const email = await sheetsApi.getUserEmail();
          setUserEmail(email);
        }
      } catch (error) {
        console.error('Failed to initialize Google API:', error);
        setUseLocalData(true);
      }
    };

    initGoogleApi();
  }, []);

  // Load data from Google Sheets when month changes
  useEffect(() => {
    const loadMonthData = async () => {
      if (!gapiReady || !sheetsApi.isSignedIn()) {
        setUseLocalData(true);
        return;
      }

      setIsLoading(true);
      try {
        // Check if month tab exists, create if it doesn't
        const tabExists = await sheetsApi.monthTabExists(currentMonth);
        if (!tabExists) {
          await sheetsApi.createMonthTab(currentMonth);
          // New tab will be empty, so set empty transactions
          setTransactions(prev => ({
            ...prev,
            [currentMonth]: []
          }));
        } else {
          // Tab exists, load data
          const sheetData = await sheetsApi.readMonthData(currentMonth);
          const txns = sheetData.map(sheetRowToTransaction);
          setTransactions(prev => ({
            ...prev,
            [currentMonth]: txns
          }));
        }
        setUseLocalData(false);
      } catch (error: any) {
        // Only show toast for real errors, not auth issues
        if (error?.message && !error.message.includes('Not authenticated')) {
          toast.error("Failed to load data from Google Sheets");
        }
        setUseLocalData(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthData();
  }, [currentMonth, gapiReady]);

  // Load available month tabs
  useEffect(() => {
    const loadTabs = async () => {
      if (!gapiReady || !sheetsApi.isSignedIn()) return;

      try {
        const tabs = await sheetsApi.getSheetTabs();
        // Initialize empty arrays for each tab
        const tabData: Record<string, Transaction[]> = {};
        tabs.forEach(tab => {
          if (!transactions[tab]) {
            tabData[tab] = [];
          }
        });
        if (Object.keys(tabData).length > 0) {
          setTransactions(prev => ({ ...prev, ...tabData }));
        }
      } catch (error) {
      }
    };

    loadTabs();
  }, [gapiReady]);

  const currentMonthTransactions = useMemo(() => {
    return (transactions[currentMonth] || []).filter((t) => !t.deleted);
  }, [transactions, currentMonth]);

  const monthTabs = useMemo(() => {
    return Object.keys(transactions).sort().reverse();
  }, [transactions]);

  const summary = useMemo(() => {
    const expense = currentMonthTransactions.reduce(
      (sum, t) => sum + (t.expense || 0),
      0
    );
    return {
      expense,
      transactionCount: currentMonthTransactions.length,
    };
  }, [currentMonthTransactions]);

  const addTransaction = useCallback(
    async (data: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "deleted">) => {
      const monthTab = getMonthTabName(new Date(data.date));
      
      if (!useLocalData) {
        try {
          setIsLoading(true);
          const sheetRow = await sheetsApi.addTransaction(monthTab, {
            date: data.date,
            expense: data.expense || 0,
            category: data.category,
            account: data.account,
            notes: data.notes || "",
            image: data.image || "",
          });
          
          const newTransaction = sheetRowToTransaction(sheetRow);
          setTransactions((prev) => ({
            ...prev,
            [monthTab]: [...(prev[monthTab] || []), newTransaction],
          }));
          
          return newTransaction;
        } catch (error) {
          toast.error("Failed to save to Google Sheets");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
      
      // Fallback to local storage
      const newTransaction: Transaction = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
      };

      setTransactions((prev) => ({
        ...prev,
        [monthTab]: [...(prev[monthTab] || []), newTransaction],
      }));

      return newTransaction;
    },
    [useLocalData]
  );

  const updateTransaction = useCallback(
    async (id: string, data: Partial<Transaction>) => {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Find which month the transaction is currently in
      let oldMonth: string | null = null;
      let existingTransaction: Transaction | null = null;

      Object.entries(transactions).forEach(([month, txns]) => {
        const found = txns.find((t) => t.id === id);
        if (found) {
          oldMonth = month;
          existingTransaction = found;
        }
      });

      if (!oldMonth || !existingTransaction) return;

      const newMonth = data.date
        ? getMonthTabName(new Date(data.date))
        : oldMonth;

      if (!useLocalData) {
        try {
          setIsLoading(true);
          const updatedTransaction = { ...existingTransaction, ...updatedData };
          
          if (newMonth !== oldMonth) {
            // Delete from old month, add to new month
            await sheetsApi.deleteRowById(oldMonth, id);
            await sheetsApi.addTransaction(newMonth, {
              date: updatedTransaction.date,
              expense: updatedTransaction.expense || 0,
              category: updatedTransaction.category,
              account: updatedTransaction.account,
              notes: updatedTransaction.notes || "",
            });
          } else {
            // Update in place
            await sheetsApi.updateRowById(oldMonth, id, {
              id,
              date: updatedTransaction.date,
              expense: updatedTransaction.expense || 0,
              category: updatedTransaction.category,
              account: updatedTransaction.account,
              notes: updatedTransaction.notes || "",
              createdAt: updatedTransaction.createdAt,
              updatedAt: updatedTransaction.updatedAt,
            });
          }
        } catch (error) {
          toast.error("Failed to update in Google Sheets");
          console.error(error);
          return;
        } finally {
          setIsLoading(false);
        }
      }

      if (newMonth !== oldMonth) {
        // Move transaction to new month
        setTransactions((prev) => {
          const updated = { ...prev };
          updated[oldMonth!] = updated[oldMonth!].filter((t) => t.id !== id);
          const updatedTransaction = { ...existingTransaction!, ...updatedData };
          updated[newMonth] = [...(updated[newMonth] || []), updatedTransaction];
          return updated;
        });
      } else {
        // Update in place
        setTransactions((prev) => ({
          ...prev,
          [oldMonth!]: prev[oldMonth!].map((t) =>
            t.id === id ? { ...t, ...updatedData } : t
          ),
        }));
      }
    },
    [transactions, useLocalData]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      // Find which month the transaction is in and get the transaction
      let targetMonth: string | null = null;
      let targetTransaction: Transaction | null = null;
      Object.entries(transactions).forEach(([month, txns]) => {
        const found = txns.find((t) => t.id === id);
        if (found) {
          targetMonth = month;
          targetTransaction = found;
        }
      });

      // Delete image from Drive if it exists
      if (targetTransaction?.image) {
        try {
          await deleteImageFromDrive(targetTransaction.image);
        } catch (error) {
          console.warn('Failed to delete image from Drive:', error);
          // Continue with transaction deletion even if image deletion fails
        }
      }

      if (!useLocalData && targetMonth) {
        try {
          setIsLoading(true);
          await sheetsApi.deleteRowById(targetMonth, id);
        } catch (error) {
          toast.error("Failed to delete from Google Sheets");
          console.error(error);
          return;
        } finally {
          setIsLoading(false);
        }
      }

      // Hard delete - permanently remove the transaction
      setTransactions((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((month) => {
          updated[month] = updated[month].filter((t) => t.id !== id);
        });
        return updated;
      });
    },
    [transactions, useLocalData]
  );

  return {
    transactions: currentMonthTransactions,
    allTransactions: transactions,
    currentMonth,
    setCurrentMonth,
    monthTabs,
    summary,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isConnected: sheetsApi.isApiConfigured && sheetsApi.isSignedIn() && !useLocalData,
    userEmail,
  };
}
