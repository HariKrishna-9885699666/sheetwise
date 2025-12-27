import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

  // Reset form when dialog closes
  useEffect(() => {
    console.log('BulkExpenseForm useEffect - open:', open);
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
      return;
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
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 p-4 border rounded-lg relative"
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
                <div className="col-span-12 sm:col-span-3">
                  <Label htmlFor={`date-${index}`}>Date</Label>
                  <Input
                    id={`date-${index}`}
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRow(index, "date", e.target.value)}
                    required
                  />
                </div>

                {/* Amount */}
                <div className="col-span-12 sm:col-span-2">
                  <Label htmlFor={`expense-${index}`}>Amount ₹</Label>
                  <Input
                    id={`expense-${index}`}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={row.expense}
                    onChange={(e) => updateRow(index, "expense", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-span-12 sm:col-span-3">
                  <Label htmlFor={`category-${index}`}>Category</Label>
                  <SearchSelect
                    options={categories}
                    value={row.category}
                    onChange={(value) => updateRow(index, "category", value)}
                    placeholder="Select category"
                    iconMap={categoryIcons}
                  />
                </div>

                {/* Account */}
                <div className="col-span-12 sm:col-span-2">
                  <Label htmlFor={`account-${index}`}>Account</Label>
                  <SearchSelect
                    options={accounts}
                    value={row.account}
                    onChange={(value) => updateRow(index, "account", value)}
                    placeholder="Account"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-12 sm:col-span-2">
                  <Label htmlFor={`notes-${index}`}>Notes</Label>
                  <Input
                    id={`notes-${index}`}
                    placeholder="Optional"
                    value={row.notes}
                    onChange={(e) => updateRow(index, "notes", e.target.value)}
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

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : `Save All (${rows.filter(r => r.date && r.expense && r.category).length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
