import { useState, useMemo } from "react";
import { Transaction } from "@/types/transaction";
import { useTransactions } from "@/hooks/useTransactions";
import { Header } from "@/components/Header";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { BulkExpenseForm } from "@/components/BulkExpenseForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { ProfileModal } from "@/components/ProfileModal";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as sheetsApi from "@/lib/google-sheets";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/types/transaction";
import { 
  XCircle, 
  Wallet, 
  Plus, 
  ChevronDown,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Popcorn,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  Briefcase,
  TrendingUp as TrendingUpIcon,
  Gift as GiftIcon,
  MoreHorizontal,
  FileText,
  Files,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categoryIcons: Record<string, any> = {
  "Food & Dining": UtensilsCrossed,
  Transportation: Car,
  Shopping: ShoppingBag,
  Entertainment: Popcorn,
  "Bills & Utilities": Zap,
  Healthcare: Heart,
  Education: GraduationCap,
  Travel: Plane,
  Salary: Wallet,
  Freelance: Briefcase,
  Investment: TrendingUpIcon,
  Gift: GiftIcon,
  Other: MoreHorizontal,
};

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
    isLoading,
    userEmail,
  } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  // Search, filter, sort state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("date-desc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("date-desc");
  };

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(t =>
        t.notes.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s) ||
        t.account.toLowerCase().includes(s)
      );
    }
    if (category && category !== "all") {
      filtered = filtered.filter(t => t.category === category);
    }
    if (sort === "date-desc") {
      filtered = filtered.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === "date-asc") {
      filtered = filtered.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === "amount-desc") {
      filtered = filtered.slice().sort((a, b) => (b.expense || 0) - (a.expense || 0));
    } else if (sort === "amount-asc") {
      filtered = filtered.slice().sort((a, b) => (a.expense || 0) - (b.expense || 0));
    }
    return filtered;
  }, [transactions, search, category, sort]);

  const handleAddTransaction = () => {
    console.log('handleAddTransaction called, current state:', isFormOpen);
    setEditingTransaction(null);
    setIsBulkFormOpen(false); // Ensure bulk form is closed
    setTimeout(() => {
      console.log('Setting isFormOpen to true');
      setIsFormOpen(true);
    }, 0);
  };

  const handleAddBulkExpense = () => {
    console.log('handleAddBulkExpense called, current state:', isBulkFormOpen);
    setEditingTransaction(null);
    setIsFormOpen(false); // Ensure single form is closed
    setTimeout(() => {
      console.log('Setting isBulkFormOpen to true');
      setIsBulkFormOpen(true);
    }, 0);
  };

  const handleBulkExpenseSave = async (
    expenses: Omit<Transaction, "id" | "createdAt" | "updatedAt">[]
  ) => {
    try {
      for (const expense of expenses) {
        await addTransaction(expense);
      }
      toast({
        title: "Expenses added",
        description: `Successfully added ${expenses.length} expense${expenses.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some expenses. Please try again.",
        variant: "destructive",
      });
    }
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
    setIsFormOpen(false);
  };

  const handleSignOut = () => {
    sheetsApi.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out from Google Sheets.",
    });
    window.location.reload(); // Reload to reset state
  };

  const handleSignIn = async () => {
    try {
      await sheetsApi.signIn();
      toast({
        title: "Connected",
        description: "Successfully connected to Google Sheets.",
      });
      window.location.reload(); // Reload to fetch data
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to Google Sheets. Please try again.",
        variant: "destructive",
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
        onAddBulkExpense={handleAddBulkExpense}
        isConnected={isConnected}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onSignIn={handleSignIn}
      />

      <main className="container px-4 py-4 md:py-8 md:px-6">
        <div className="space-y-2 md:space-y-8">
          {/* Header with Month */}
          <div className="hidden md:flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">
              Expenses for {currentMonth}
            </h1>
          </div>
          
          {/* Mobile: Centered Month Header */}
          <div className="md:hidden flex items-center justify-center">
            <h1 className="text-xl font-semibold text-foreground">
              Expenses for {currentMonth}
            </h1>
          </div>

          {isLoading ? (
            <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3 sm:p-6 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
                      <Skeleton className="h-4 sm:h-8 w-20 sm:w-32" />
                    </div>
                    <Skeleton className="h-6 w-6 sm:h-10 sm:w-10 rounded-lg ml-1 sm:ml-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="hidden md:block">
              <SummaryCards
                expense={summary.expense}
                transactionCount={summary.transactionCount}
                currentMonth={currentMonth}
              />
            </div>
          )}

          <div className="space-y-4">
            {/* Mobile: Collapsible Filters */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="md:hidden">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>Filters & Sort</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                <Input
                  placeholder="Search notes, category, account..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => {
                      const Icon = categoryIcons[cat];
                      return (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            {cat}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Amount High-Low</SelectItem>
                    <SelectItem value="amount-asc">Amount Low-High</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="w-full"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Desktop: Original Layout */}
            <div className="hidden md:flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2 items-stretch sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row flex-1 gap-2 min-w-0">
                <Input
                  placeholder="Search notes, category, account..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="max-w-xs w-full"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => {
                      const Icon = categoryIcons[cat];
                      return (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            {cat}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="sm:ml-1 flex items-center justify-center rounded-full border border-border bg-background p-2 text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring min-w-[56px]"
                  title="Reset filters"
                  aria-label="Reset filters"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Amount High-Low</SelectItem>
                    <SelectItem value="amount-asc">Amount Low-High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                {/* Skeleton Total Expenses Header */}
                <div className="border-b-2 border-border bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[100px] font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Account</TableHead>
                      <TableHead className="font-semibold">Notes</TableHead>
                      <TableHead className="font-semibold">Image</TableHead>
                      <TableHead className="text-right font-semibold">Expense</TableHead>
                      <TableHead className="text-center font-semibold w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i} className="border-border">
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Skeleton Total Expenses Footer */}
                <div className="border-t-2 border-border bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            ) : (
              <TransactionList
                transactions={filteredTransactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteClick}
              />
            )}
          </div>
        </div>
      </main>

      <TransactionForm
        key={isFormOpen ? 'form-open' : 'form-closed'}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        transaction={editingTransaction}
        onSubmit={handleFormSubmit}
      />

      <BulkExpenseForm
        key={isBulkFormOpen ? 'bulk-open' : 'bulk-closed'}
        open={isBulkFormOpen}
        onOpenChange={setIsBulkFormOpen}
        onSave={handleBulkExpenseSave}
        currentMonth={currentMonth}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />

      {/* Floating Action Button for Mobile with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg font-semibold">Add Expense</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top" className="w-56 mb-2">
          <DropdownMenuItem onClick={handleAddTransaction}>
            <FileText className="h-4 w-4 mr-2" />
            Single Expense
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddBulkExpense}>
            <Files className="h-4 w-4 mr-2" />
            Multiple Expenses
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Modal */}
      <ProfileModal />
    </div>
  );
};

export default Index;
