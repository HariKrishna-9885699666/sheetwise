import {
  Pencil,
  Trash2,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateShort } from "@/lib/date-utils";
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

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Food & Dining": { bg: "bg-orange-100", text: "text-orange-700" },
  Transportation: { bg: "bg-blue-100", text: "text-blue-700" },
  Shopping: { bg: "bg-pink-100", text: "text-pink-700" },
  Entertainment: { bg: "bg-purple-100", text: "text-purple-700" },
  "Bills & Utilities": { bg: "bg-slate-100", text: "text-slate-700" },
  Healthcare: { bg: "bg-red-100", text: "text-red-700" },
  Education: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Travel: { bg: "bg-cyan-100", text: "text-cyan-700" },
  Salary: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Freelance: { bg: "bg-teal-100", text: "text-teal-700" },
  Investment: { bg: "bg-amber-100", text: "text-amber-700" },
  Gift: { bg: "bg-rose-100", text: "text-rose-700" },
  Other: { bg: "bg-gray-100", text: "text-gray-700" },
};

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const totalExpenses = transactions.reduce((sum, t) => sum + (t.expense || 0), 0);
  console.log("totalExpenses", transactions);

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
          {transactions.map((transaction, index) => {
            const colors = categoryColors[transaction.category] || {
              bg: "bg-gray-100",
              text: "text-gray-700",
            };
            // Check if transaction is within last 10 days
            const transactionDate = new Date(transaction.date);
            const today = new Date();
            const tenDaysAgo = new Date(today);
            tenDaysAgo.setDate(today.getDate() - 10);
            const isEditable = transactionDate >= tenDaysAgo;
            return (
              <TableRow
                key={transaction.id}
                className="group border-border animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell className="font-medium text-muted-foreground">
                  {formatDateShort(transaction.date)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-medium border-0",
                      colors.bg,
                      colors.text
                    )}
                  >
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.account}
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {transaction.notes || "—"}
                </TableCell>
                <TableCell className="text-center">
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
                </TableCell>
                <TableCell className="text-right">
                  {transaction.expense ? (
                    <span className="font-mono font-medium text-expense">
                      -{formatCurrency(transaction.expense)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
