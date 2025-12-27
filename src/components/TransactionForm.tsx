import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  CalendarIcon,
  Bus,
  Receipt,
  Utensils,
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
  TrendingUp as TrendingUpIcon,
  Gift as GiftIcon,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction, CATEGORIES, ACCOUNTS } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadImageToDrive, deleteImageFromDrive } from "@/lib/google-drive";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchSelect } from "@/components/ui/search-select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  amount: z.number({ required_error: "Amount is required" }).positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  account: z.string().min(1, "Account is required"),
  notes: z.string().optional(),
  image: z.string().optional(), // Will store Drive URL instead of base64
});

type FormValues = z.infer<typeof formSchema>;

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

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSubmit: (data: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "deleted">) => void;
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}: TransactionFormProps) {
  const isEditing = !!transaction;
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      amount: undefined,
      category: "",
      account: "Savings",
      notes: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (!open) {
      // Reset everything when dialog closes
      form.reset({
        date: new Date(),
        amount: undefined,
        category: "",
        account: "Savings",
        notes: "",
        image: undefined,
      });
      setImagePreview(null);
      setSelectedFile(null);
      return;
    }

    // When dialog opens, populate with transaction data or defaults
    if (transaction) {
      form.reset({
        date: new Date(transaction.date),
        amount: transaction.expense || 0,
        category: transaction.category,
        account: transaction.account,
        notes: transaction.notes || "",
        image: transaction.image || undefined,
      });
      setImagePreview(transaction.image || null);
    } else {
      form.reset({
        date: new Date(),
        amount: undefined,
        category: "",
        account: "Savings",
        notes: "",
        image: undefined,
      });
      setImagePreview(null);
    }
  }, [open, transaction, form]);

  // Image resize and validation
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      form.setError("image", { message: "Image must be less than 1MB" });
      return;
    }
    
    // Resize image for preview only
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!ev.target?.result) return;
      img.onload = () => {
        // Resize for preview
        const canvas = document.createElement("canvas");
        const maxDim = 600;
        let w = img.width, h = img.height;
        if (w > h) {
          if (w > maxDim) { h *= maxDim / w; w = maxDim; }
        } else {
          if (h > maxDim) { w *= maxDim / h; h = maxDim; }
        }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const base64 = canvas.toDataURL("image/jpeg", 0.85);
          setImagePreview(base64);
          setSelectedFile(file); // Store original file for upload
        }
      };
      img.src = ev.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: FormValues) => {
    setIsUploading(true);
    try {
      let imageUrl = values.image || "";
      const oldImageUrl = transaction?.image; // Store old image URL for deletion
      
      // If there's a new file selected, upload it to Drive
      if (selectedFile) {
        toast({
          title: "Uploading image...",
          description: "Please wait while we upload your receipt to Google Drive.",
        });
        
        // Delete old image if it exists and we're replacing it
        if (oldImageUrl && isEditing) {
          try {
            await deleteImageFromDrive(oldImageUrl);
          } catch (error) {
            console.warn('Failed to delete old image:', error);
            // Continue even if deletion fails
          }
        }
        
        imageUrl = await uploadImageToDrive(selectedFile);
      }

      const data = {
        date: `${format(values.date, "yyyy-MM-dd")}T${new Date().toTimeString().split(' ')[0]}`,
        expense: values.amount,
        category: values.category,
        account: values.account,
        notes: values.notes || "",
        image: imageUrl,
      };
      
      onSubmit(data);
      onOpenChange(false);
      form.reset();
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image to Google Drive. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const currentCategories = CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Only expense transactions allowed. No type/tabs. */}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => {
                            const tenDaysAgo = new Date();
                            tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
                            tenDaysAgo.setHours(0, 0, 0, 0);
                            return date < tenDaysAgo;
                          }}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    {/* Quick-select icons */}
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant={field.value === "Transportation" ? "default" : "outline"}
                        size="icon"
                        className={field.value === "Transportation" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
                        onClick={() => field.onChange("Transportation")}
                        title="Transportation"
                        aria-label="Transportation"
                      >
                        <Bus className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Bills & Utilities" ? "default" : "outline"}
                        size="icon"
                        className={field.value === "Bills & Utilities" ? "bg-slate-100 text-slate-700 border-slate-200" : ""}
                        onClick={() => field.onChange("Bills & Utilities")}
                        title="Bills & Utilities"
                        aria-label="Bills & Utilities"
                      >
                        <Receipt className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Food & Dining" ? "default" : "outline"}
                        size="icon"
                        className={field.value === "Food & Dining" ? "bg-orange-100 text-orange-700 border-orange-200" : ""}
                        onClick={() => field.onChange("Food & Dining")}
                        title="Food & Dining"
                        aria-label="Food & Dining"
                      >
                        <Utensils className="h-5 w-5" />
                      </Button>
                    </div>
                    <SearchSelect
                      options={currentCategories}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select category"
                      iconMap={categoryIcons}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <SearchSelect
                      options={ACCOUNTS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select account"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt/Image (optional)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-32 rounded border object-contain"
                        />
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-fit"
                      >
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </Button>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={async () => {
                            // If editing and there's an existing Drive image, delete it
                            if (isEditing && transaction?.image && !selectedFile) {
                              try {
                                await deleteImageFromDrive(transaction.image);
                                toast({
                                  title: "Image removed",
                                  description: "The image has been deleted from Google Drive.",
                                });
                              } catch (error) {
                                console.error('Failed to delete image:', error);
                                toast({
                                  title: "Warning",
                                  description: "Failed to delete image from Drive, but it will be removed from the transaction.",
                                  variant: "destructive",
                                });
                              }
                            }
                            setImagePreview(null);
                            setSelectedFile(null);
                            form.setValue("image", undefined, { shouldValidate: true });
                          }}
                          className="w-fit text-xs text-muted-foreground"
                        >
                          Remove Image
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : isEditing ? "Save Changes" : "Add Expense"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
