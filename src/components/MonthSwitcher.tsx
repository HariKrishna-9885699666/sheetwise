import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMonthDisplayName,
  parseMonthTabName,
  getNextMonth,
  getPreviousMonth,
  getCurrentMonthTab,
  isValidMonthTab,
} from "@/lib/date-utils";

interface MonthSwitcherProps {
  currentMonth: string;
  monthTabs: string[];
  onMonthChange: (month: string) => void;
}

export function MonthSwitcher({
  currentMonth,
  monthTabs,
  onMonthChange,
}: MonthSwitcherProps) {
  // Filter out invalid month tabs (like "Sheet1", etc.)
  const validMonthTabs = monthTabs.filter(isValidMonthTab);
  
  const currentDate = parseMonthTabName(currentMonth);
  const displayName = getMonthDisplayName(currentDate);
  const isCurrentMonth = currentMonth === getCurrentMonthTab();

  const handlePrevious = () => {
    onMonthChange(getPreviousMonth(currentMonth));
  };

  const handleNext = () => {
    onMonthChange(getNextMonth(currentMonth));
  };

  const handleToday = () => {
    onMonthChange(getCurrentMonthTab());
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-border bg-card p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select value={currentMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-8 w-[140px] border-0 bg-transparent font-medium shadow-none focus:ring-0">
            <SelectValue>{displayName}</SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {validMonthTabs.map((tab) => (
              <SelectItem key={tab} value={tab}>
                {getMonthDisplayName(parseMonthTabName(tab))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {!isCurrentMonth && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="h-8 gap-1.5 text-xs"
        >
          <Calendar className="h-3.5 w-3.5" />
          Today
        </Button>
      )}
    </div>
  );
}
