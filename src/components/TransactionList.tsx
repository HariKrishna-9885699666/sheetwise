import { useState } from "react";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateShort } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[100px] font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Account</TableHead>
            <TableHead className="font-semibold">Notes</TableHead>
            <TableHead className="text-right font-semibold">Expense</TableHead>
            <TableHead className="text-right font-semibold">Income</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction, index) => {
            const colors = categoryColors[transaction.category] || {
              bg: "bg-gray-100",
              text: "text-gray-700",
            };
            const isIncome = transaction.income && transaction.income > 0;

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
                <TableCell className="text-right">
                  {transaction.expense ? (
                    <span className="font-mono font-medium text-expense">
                      -{formatCurrency(transaction.expense)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.income ? (
                    <span className="font-mono font-medium text-income">
                      +{formatCurrency(transaction.income)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => onEdit(transaction)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(transaction.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
