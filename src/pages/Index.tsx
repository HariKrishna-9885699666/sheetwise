import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { useTransactions } from "@/hooks/useTransactions";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { ApiStatusBanner } from "@/components/ApiStatusBanner";
import { useToast } from "@/hooks/use-toast";
import { isApiConfigured } from "@/lib/google-sheets";

const Index = () => {
  const { toast } = useToast();
  const {
    transactions,
    currentMonth,
    setCurrentMonth,
    monthTabs,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isConnected,
  } = useTransactions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed.",
      });
    }
    setDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleFormSubmit = (
    data: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "deleted">
  ) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      toast({
        title: "Transaction updated",
        description: "Your changes have been saved.",
      });
    } else {
      addTransaction(data);
      toast({
        title: "Transaction added",
        description: "Your transaction has been recorded.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentMonth={currentMonth}
        monthTabs={monthTabs}
        onMonthChange={setCurrentMonth}
        onAddTransaction={handleAddTransaction}
        isConnected={isConnected}
      />

      <main className="container px-4 py-8 md:px-6">
        <div className="space-y-8">
          <ApiStatusBanner />
          
          <SummaryCards
            expense={summary.expense}
            balance={summary.balance}
            transactionCount={summary.transactionCount}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </div>

            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </main>

      <TransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        transaction={editingTransaction}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
