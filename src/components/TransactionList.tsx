import {
  Pencil,
  Trash2,
  TrendingUp,
  Image as ImageIcon,
  Calendar,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Popcorn,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  Wallet,
  Briefcase,
  TrendingUpIcon,
  Gift as GiftIcon,
  MoreHorizontal,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateShort } from "@/lib/date-utils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string; icon: any }> = {
  "Food & Dining": { bg: "bg-orange-100", text: "text-orange-700", icon: UtensilsCrossed },
  Transportation: { bg: "bg-blue-100", text: "text-blue-700", icon: Car },
  Shopping: { bg: "bg-pink-100", text: "text-pink-700", icon: ShoppingBag },
  Entertainment: { bg: "bg-purple-100", text: "text-purple-700", icon: Popcorn },
  "Bills & Utilities": { bg: "bg-slate-100", text: "text-slate-700", icon: Zap },
  Healthcare: { bg: "bg-red-100", text: "text-red-700", icon: Heart },
  Education: { bg: "bg-indigo-100", text: "text-indigo-700", icon: GraduationCap },
  Travel: { bg: "bg-cyan-100", text: "text-cyan-700", icon: Plane },
  Salary: { bg: "bg-emerald-100", text: "text-emerald-700", icon: Wallet },
  Freelance: { bg: "bg-teal-100", text: "text-teal-700", icon: Briefcase },
  Investment: { bg: "bg-amber-100", text: "text-amber-700", icon: TrendingUpIcon },
  Gift: { bg: "bg-rose-100", text: "text-rose-700", icon: GiftIcon },
  Other: { bg: "bg-gray-100", text: "text-gray-700", icon: MoreHorizontal },
};

// Group transactions by date
function groupTransactionsByDate(transactions: Transaction[]): Map<string, Transaction[]> {
  const grouped = new Map<string, Transaction[]>();
  
  transactions.forEach((transaction) => {
    const dateKey = format(new Date(transaction.date), "yyyy-MM-dd");
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(transaction);
  });
  
  return grouped;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const totalExpenses = transactions.reduce((sum, t) => sum + (t.expense || 0), 0);
  const groupedTransactions = groupTransactionsByDate(transactions);
  const sortedDates = Array.from(groupedTransactions.keys()).sort().reverse();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No transactions yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      {/* Total Expenses at Top */}
      {transactions.length > 0 && (
        <div className="border-b-2 border-border bg-gradient-to-r from-orange-50 to-amber-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-700">TOTAL EXPENSES</span>
            <span className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-border">
        {sortedDates.map((dateKey) => {
          const dayTransactions = groupedTransactions.get(dateKey)!;
          const dayTotal = dayTransactions.reduce((sum, t) => sum + (t.expense || 0), 0);
          const displayDate = format(new Date(dateKey), "dd MMM yyyy, EEEE");
          const today = new Date();
          const tenDaysAgo = new Date(today);
          tenDaysAgo.setDate(today.getDate() - 10);

          return (
            <div key={dateKey} className="animate-fade-in">
              {/* Date Header */}
              <div className="bg-muted/50 px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">{displayDate}</span>
                </div>
                <span className="font-mono font-semibold text-orange-600 text-sm sm:text-base whitespace-nowrap">
                  -{formatCurrency(dayTotal)}
                </span>
              </div>

              {/* Transactions for this date */}
              <div className="divide-y divide-border">
                {dayTransactions.map((transaction, index) => {
                  const colors = categoryColors[transaction.category] || {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    icon: MoreHorizontal,
                  };
                  const CategoryIcon = colors.icon;
                  const transactionDate = new Date(transaction.date);
                  const isEditable = transactionDate >= tenDaysAgo;
                  
                  return (
                    <div
                      key={transaction.id}
                      className="p-3 sm:p-4 hover:bg-accent/50 transition-colors"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* Mobile Layout */}
                      <div className="flex flex-col gap-3 md:hidden">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "font-medium border-0 w-fit text-xs flex items-center gap-1.5",
                                colors.bg,
                                colors.text
                              )}
                            >
                              <CategoryIcon className="h-3 w-3" />
                              {transaction.category}
                            </Badge>
                            <p className="text-sm text-muted-foreground truncate">
                              {transaction.notes || "No notes"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{transaction.account}</span>
                              {transaction.image && (
                                <>
                                  <span>•</span>
                                  <button 
                                    onClick={() => window.open(transaction.image, '_blank')}
                                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                                  >
                                    <ImageIcon className="h-3 w-3" />
                                    <span>View</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono font-semibold text-expense text-base">
                              -{formatCurrency(transaction.expense || 0)}
                            </div>
                          </div>
                        </div>
                        {isEditable && (
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => onEdit(transaction)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-destructive hover:text-destructive"
                              onClick={() => onDelete(transaction.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-[140px_120px_1fr_60px_120px_100px] md:gap-4 md:items-center">
                        <div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-medium border-0 flex items-center gap-1.5 w-fit",
                              colors.bg,
                              colors.text
                            )}
                          >
                            <CategoryIcon className="h-3.5 w-3.5" />
                            {transaction.category}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground truncate">
                          {transaction.account}
                        </div>
                        <div className="text-muted-foreground truncate">
                          {transaction.notes || "—"}
                        </div>
                        <div className="text-center">
                          {transaction.image ? (
                            <button 
                              onClick={() => window.open(transaction.image, '_blank')}
                              className="inline-flex items-center justify-center p-2 rounded hover:bg-accent transition-colors"
                              title="Open image in new tab"
                            >
                              <ImageIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                            </button>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-medium text-expense">
                            -{formatCurrency(transaction.expense || 0)}
                          </span>
                        </div>
                        <div className="text-center">
                          {isEditable ? (
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onEdit(transaction)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => onDelete(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {transactions.length > 0 && (
        <div className="border-t-2 border-border bg-gradient-to-r from-orange-50 to-amber-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-700">TOTAL EXPENSES</span>
            <span className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
