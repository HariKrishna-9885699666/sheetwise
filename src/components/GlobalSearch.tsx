import { useState } from "react";
import { Search, X, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allTransactions: Record<string, Transaction[]>;
  onSelectTransaction: (transaction: Transaction, month: string) => void;
}

export function GlobalSearch({
  open,
  onOpenChange,
  allTransactions,
  onSelectTransaction,
}: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Search across all months
  const searchResults = Object.entries(allTransactions).flatMap(([month, transactions]) =>
    transactions
      .filter((t) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return false;
        
        return (
          t.category.toLowerCase().includes(query) ||
          t.notes.toLowerCase().includes(query) ||
          t.account.toLowerCase().includes(query) ||
          t.expense?.toString().includes(query) ||
          format(new Date(t.date), "dd MMM yyyy").toLowerCase().includes(query)
        );
      })
      .map((t) => ({ transaction: t, month }))
  );

  const handleSelectResult = (transaction: Transaction, month: string) => {
    onSelectTransaction(transaction, month);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search All Expenses</DialogTitle>
          <DialogDescription>
            Search by category, notes, account, amount, or date across all months
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          )}

          {searchQuery && searchResults.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground px-2 py-1">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
              {searchResults.map(({ transaction, month }, index) => (
                <button
                  key={`${transaction.id}-${index}`}
                  onClick={() => handleSelectResult(transaction, month)}
                  className="w-full p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{transaction.category}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{month}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(transaction.date), "dd MMM yyyy")}</span>
                        <span>•</span>
                        <span>{transaction.account}</span>
                      </div>
                      {transaction.notes && (
                        <p className="text-xs text-muted-foreground truncate">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 font-mono font-semibold text-expense">
                      -{formatCurrency(transaction.expense || 0)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Start typing to search across all months</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
