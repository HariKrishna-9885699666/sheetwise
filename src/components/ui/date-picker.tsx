import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isSameDay,
  subDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface CalendarPanelProps {
  value?: Date;
  onChange?: (date: Date) => void;
  onClose?: () => void;
}

function CalendarPanel({ value, onChange, onClose }: CalendarPanelProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = React.useState<Date>(value ?? today);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart);

  const quickPicks = [
    { label: "Today", date: today },
    { label: "Yesterday", date: subDays(today, 1) },
    { label: "2 days ago", date: subDays(today, 2) },
    { label: "3 days ago", date: subDays(today, 3) },
  ];

  const currentYear = today.getFullYear();

  function select(date: Date) {
    onChange?.(date);
    onClose?.();
  }

  return (
    <div className="w-72 p-4 select-none">
      {/* Quick picks */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {quickPicks.map((q) => {
          const active = value && isSameDay(value, q.date);
          return (
            <button
              key={q.label}
              type="button"
              onClick={() => select(q.date)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-muted/40 text-foreground hover:bg-muted"
              )}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      <div className="h-px bg-border mb-3" />

      {/* Month / Year navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          <select
            value={viewMonth.getMonth()}
            onChange={(e) => {
              const d = new Date(viewMonth);
              d.setMonth(Number(e.target.value));
              setViewMonth(d);
            }}
            className="bg-transparent text-sm font-semibold outline-none cursor-pointer hover:text-primary transition-colors"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2000, i, 1), "MMMM")}
              </option>
            ))}
          </select>
          <select
            value={viewMonth.getFullYear()}
            onChange={(e) => {
              const d = new Date(viewMonth);
              d.setFullYear(Number(e.target.value));
              setViewMonth(d);
            }}
            className="bg-transparent text-sm font-semibold outline-none cursor-pointer hover:text-primary transition-colors"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const y = currentYear - 3 + i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="h-7 flex items-center justify-center text-[11px] font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const isSelected = value && isSameDay(value, day);
          const isTodayDate = isToday(day);
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => select(day)}
              className={cn(
                "mx-auto h-8 w-8 flex items-center justify-center rounded-full text-sm font-normal transition-colors",
                isSelected &&
                  "bg-primary text-primary-foreground font-semibold shadow-sm",
                !isSelected &&
                  isTodayDate &&
                  "border-2 border-primary text-primary font-semibold",
                !isSelected && !isTodayDate && "hover:bg-accent"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const triggerContent = (
    <>
      <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className={cn("flex-1 text-left", !value && "text-muted-foreground")}>
        {value ? format(value, "EEE, dd MMM yyyy") : placeholder}
      </span>
    </>
  );

  const panel = (
    <CalendarPanel
      value={value}
      onChange={(d) => onChange?.(d)}
      onClose={() => setOpen(false)}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/50",
            className
          )}
        >
          {triggerContent}
        </button>
        <DrawerContent>
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-base">Select Date</DrawerTitle>
          </DrawerHeader>
          <div className="flex justify-center pb-8 pt-2">{panel}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/50",
            className
          )}
        >
          {triggerContent}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover shadow-lg" align="start">
        {panel}
      </PopoverContent>
    </Popover>
  );
}
