import { TrendingDown, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  expense: number;
  transactionCount: number;
  currentMonth?: string;
}

export function SummaryCards({
  expense,
  transactionCount,
  currentMonth,
}: SummaryCardsProps) {
  const cards = [
    {
      title: currentMonth ? `${currentMonth} Expenses` : "Total Expenses",
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
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="stat-card animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {card.title}
              </p>
              <p
                className={cn(
                  "mt-1 sm:mt-2 text-base sm:text-2xl font-semibold tracking-tight",
                  card.colorClass
                )}
              >
                {card.format(card.value)}
              </p>
            </div>
            <div className={cn("rounded-lg p-1.5 sm:p-2.5 ml-1 sm:ml-0", card.bgClass)}>
              <card.icon className={cn("h-3 w-3 sm:h-5 sm:w-5", card.colorClass)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
