import { TrendingDown, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  expense: number;
  transactionCount: number;
}

export function SummaryCards({
  expense,
  transactionCount,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Expenses",
      value: expense,
      icon: TrendingDown,
      colorClass: "text-expense",
      bgClass: "bg-expense-light",
      format: formatCurrency,
    },
    {
      title: "Transactions",
      value: transactionCount,
      icon: ArrowUpDown,
      colorClass: "text-muted-foreground",
      bgClass: "bg-muted",
      format: (v: number) => v.toString(),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="stat-card animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p
                className={cn(
                  "mt-2 text-2xl font-semibold tracking-tight",
                  card.colorClass
                )}
              >
                {card.format(card.value)}
              </p>
            </div>
            <div className={cn("rounded-lg p-2.5", card.bgClass)}>
              <card.icon className={cn("h-5 w-5", card.colorClass)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
