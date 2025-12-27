import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Home,
  Zap,
  Smartphone,
  Heart,
  GraduationCap,
  Plane,
  Film,
  ShoppingCart,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { SearchSelect } from "./ui/search-select";
import { Transaction } from "@/types/transaction";

interface BulkExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expenses: Omit<Transaction, "id" | "createdAt" | "updatedAt">[]) => Promise<void>;
  currentMonth: string;
}

interface BulkExpenseRow {
  date: string;
  expense: string;
  category: string;
  account: string;
  notes: string;
}

const categoryIcons: Record<string, any> = {
  "Food & Dining": UtensilsCrossed,
  Transportation: Car,
  Shopping: ShoppingBag,
  "Home & Utilities": Home,
  "Bills & EMI": Zap,
  "Mobile & Recharge": Smartphone,
  Healthcare: Heart,
  Education: GraduationCap,
  Travel: Plane,
  Entertainment: Film,
  Groceries: ShoppingCart,
  "Personal Care": CreditCard,
  Other: HelpCircle,
};

const categories = Object.keys(categoryIcons);
const accounts = ["Savings", "Credit Card", "Cash", "Wallet"];

export function BulkExpenseForm({
  open,
  onOpenChange,
  onSave,
  currentMonth,
}: BulkExpenseFormProps) {
  const [rows, setRows] = useState<BulkExpenseRow[]>([
    {
      date: new Date().toISOString().split("T")[0],
      expense: "",
      category: "",
      account: "Savings",
      notes: "",
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setRows([
        {
          date: new Date().toISOString().split("T")[0],
          expense: "",
          category: "",
          account: "Savings",
          notes: "",
        },
      ]);
      setIsSaving(false);
    }
  }, [open]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        date: new Date().toISOString().split("T")[0],
        expense: "",
        category: "",
        account: "Savings",
        notes: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: keyof BulkExpenseRow, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleSave = async () => {
    // Validate all rows
    const validRows = rows.filter(
      (row) => row.date && row.expense && parseFloat(row.expense) > 0 && row.category
    );

    if (validRows.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in Date, Amount, and Category for at least one expense.",
        variant: "destructive",
      });
      return;
    }

    // Check if there are invalid rows
    if (validRows.length < rows.length) {
      toast({
        title: "Some entries skipped",
        description: `${rows.length - validRows.length} incomplete row(s) will be skipped.`,
        variant: "default",
      });
    }

    setIsSaving(true);
    try {
      const expenses = validRows.map((row) => ({
        date: row.date,
        expense: parseFloat(row.expense),
        category: row.category,
        account: row.account,
        notes: row.notes,
        image: "",
        deleted: false,
      }));

      await onSave(expenses);
      
      // Close the dialog (useEffect will reset the form)
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save bulk expenses:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Multiple Expenses</DialogTitle>
          <DialogDescription>
            Fill in details for each expense row and click Save All to add them.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3 p-3 md:p-4 border rounded-lg relative"
              >
                {/* Remove button */}
                {rows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeRow(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}

                {/* Date */}
                <div className="col-span-1 md:col-span-3">
                  <Label htmlFor={`date-${index}`} className="text-xs md:text-sm">Date</Label>
                  <Input
                    id={`date-${index}`}
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRow(index, "date", e.target.value)}
                    className="text-xs md:text-sm h-8 md:h-10"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor={`expense-${index}`} className="text-xs md:text-sm">Amount</Label>
                  <Input
                    id={`expense-${index}`}
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={row.expense}
                    onChange={(e) => updateRow(index, "expense", e.target.value)}
                    className="text-xs md:text-sm h-8 md:h-10"
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-span-1 md:col-span-3">
                  <Label htmlFor={`category-${index}`} className="text-xs md:text-sm">Category</Label>
                  
                  {/* Mobile: Quick icon buttons */}
                  <div className="flex gap-1 md:hidden">
                    <button
                      type="button"
                      onClick={() => updateRow(index, "category", "Transportation")}
                      className={cn(
                        "flex-1 h-8 flex items-center justify-center rounded-md border transition-colors",
                        row.category === "Transportation" 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background hover:bg-accent"
                      )}
                    >
                      <Car className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRow(index, "category", "Food & Dining")}
                      className={cn(
                        "flex-1 h-8 flex items-center justify-center rounded-md border transition-colors",
                        row.category === "Food & Dining" 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background hover:bg-accent"
                      )}
                    >
                      <UtensilsCrossed className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRow(index, "category", "Bills & EMI")}
                      className={cn(
                        "flex-1 h-8 flex items-center justify-center rounded-md border transition-colors",
                        row.category === "Bills & EMI" 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background hover:bg-accent"
                      )}
                    >
                      <Zap className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Desktop: Full dropdown */}
                  <div className="hidden md:block [&_button]:h-10 [&_button]:text-sm">
                    <SearchSelect
                      options={categories}
                      value={row.category}
                      onChange={(value) => updateRow(index, "category", value)}
                      placeholder="Category"
                      iconMap={categoryIcons}
                    />
                  </div>
                </div>

                {/* Account - Hidden on mobile, visible on desktop */}
                <div className="hidden md:block md:col-span-2">
                  <Label htmlFor={`account-${index}`} className="text-xs md:text-sm">Account</Label>
                  <SearchSelect
                    options={accounts}
                    value={row.account}
                    onChange={(value) => updateRow(index, "account", value)}
                    placeholder="Account"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor={`notes-${index}`} className="text-xs md:text-sm">Notes</Label>
                  <Input
                    id={`notes-${index}`}
                    placeholder="Optional"
                    value={row.notes}
                    onChange={(e) => updateRow(index, "notes", e.target.value)}
                    className="text-xs md:text-sm h-8 md:h-10"
                  />
                </div>
              </div>
            ))}

            {/* Add Row Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addRow}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Expense
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-4 flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : `Save All (${rows.filter(r => r.date && r.expense && r.category).length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
