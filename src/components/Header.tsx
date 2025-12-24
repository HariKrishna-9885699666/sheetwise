import { Wallet, Plus, Settings, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthSwitcher } from "./MonthSwitcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  currentMonth: string;
  monthTabs: string[];
  onMonthChange: (month: string) => void;
  onAddTransaction: () => void;
  isConnected: boolean;
}

export function Header({
  currentMonth,
  monthTabs,
  onMonthChange,
  onAddTransaction,
  isConnected,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-semibold sm:inline-block">
              ExpenseTracker
            </span>
          </div>

          <div className="hidden h-6 w-px bg-border md:block" />

          <MonthSwitcher
            currentMonth={currentMonth}
            monthTabs={monthTabs}
            onMonthChange={onMonthChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  isConnected
                    ? "bg-income-light text-income-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Cloud className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {isConnected ? "Connected" : "Demo Mode"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isConnected
                ? "Connected to Google Sheets"
                : "Running in demo mode. Connect to Google Sheets to sync data."}
            </TooltipContent>
          </Tooltip>

          <Button onClick={onAddTransaction} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
