import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  isConnected?: boolean;
}

export function MonthSwitcher({
  currentMonth,
  monthTabs,
  onMonthChange,
  isConnected = true,
}: MonthSwitcherProps) {
  const { toast } = useToast();
  
  // Filter out invalid month tabs and sort in descending order
  const validMonthTabs = monthTabs
    .filter(isValidMonthTab)
    .sort((a, b) => {
      const dateA = parseMonthTabName(a);
      const dateB = parseMonthTabName(b);
      return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
    });
  
  const currentDate = parseMonthTabName(currentMonth);
  const displayName = getMonthDisplayName(currentDate);
  const isCurrentMonth = currentMonth === getCurrentMonthTab();

  // Generate years from 2023 to current year + 1
  const currentYear = currentDate.getFullYear();
  const startYear = 2023;
  const endYear = new Date().getFullYear() + 1;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
  const currentMonthNum = currentDate.getMonth();
  
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const handleYearChange = (year: string) => {
    if (!isConnected) {
      toast({
        title: "Connect to Google Sheets",
        description: "Please connect to Google Sheets to change months and view your transactions.",
        variant: "destructive",
      });
      return;
    }
    const newDate = new Date(parseInt(year), currentMonthNum);
    const newMonth = `${months[newDate.getMonth()].label} ${newDate.getFullYear()}`;
    onMonthChange(newMonth);
  };

  const handleMonthChange = (monthIndex: string) => {
    if (!isConnected) {
      toast({
        title: "Connect to Google Sheets",
        description: "Please connect to Google Sheets to change months and view your transactions.",
        variant: "destructive",
      });
      return;
    }
    const newDate = new Date(currentYear, parseInt(monthIndex));
    const newMonth = `${months[newDate.getMonth()].label} ${newDate.getFullYear()}`;
    onMonthChange(newMonth);
  };

  const handlePrevious = () => {
    if (!isConnected) {
      toast({
        title: "Connect to Google Sheets",
        description: "Please connect to Google Sheets to change months and view your transactions.",
        variant: "destructive",
      });
      return;
    }
    onMonthChange(getPreviousMonth(currentMonth));
  };

  const handleNext = () => {
    if (!isConnected) {
      toast({
        title: "Connect to Google Sheets",
        description: "Please connect to Google Sheets to change months and view your transactions.",
        variant: "destructive",
      });
      return;
    }
    onMonthChange(getNextMonth(currentMonth));
  };

  const handleToday = () => {
    if (!isConnected) {
      toast({
        title: "Connect to Google Sheets",
        description: "Please connect to Google Sheets to change months and view your transactions.",
        variant: "destructive",
      });
      return;
    }
    onMonthChange(getCurrentMonthTab());
  };

  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <div className="flex items-center rounded-lg border border-border bg-card p-0.5 md:p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:h-8 md:w-8"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </Button>

        <div className="flex items-center gap-0.5 md:gap-1 px-1 md:px-2">
          <Select value={currentMonthNum.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-7 md:h-8 w-[90px] md:w-[120px] border-0 bg-transparent text-xs md:text-sm font-medium shadow-none focus:ring-0">
              <SelectValue>{months[currentMonthNum].label}</SelectValue>
            </SelectTrigger>
            <SelectContent 
              className="bg-popover !min-w-0 !w-[calc(100vw-2rem)] sm:!w-[var(--radix-select-trigger-width)]" 
              position="popper"
              align="center"
            >
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="h-7 md:h-8 w-[60px] md:w-[80px] border-0 bg-transparent text-xs md:text-sm font-medium shadow-none focus:ring-0">
              <SelectValue>{currentYear}</SelectValue>
            </SelectTrigger>
            <SelectContent 
              className="bg-popover !min-w-0 !w-[calc(100vw-2rem)] sm:!w-[var(--radix-select-trigger-width)]" 
              position="popper"
              align="center"
            >
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:h-8 md:w-8"
          onClick={handleNext}
        >
          <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </Button>
      </div>

      {!isCurrentMonth && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="h-7 md:h-8 gap-1 md:gap-1.5 text-xs px-2 md:px-3"
        >
          <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">Today</span>
        </Button>
      )}
    </div>
  );
}
