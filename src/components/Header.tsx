import { Wallet, Plus, Cloud, User, Sheet, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MonthSwitcher } from "./MonthSwitcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet as SheetComponent,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  currentMonth: string;
  monthTabs: string[];
  onMonthChange: (month: string) => void;
  onAddTransaction: () => void;
  isConnected: boolean;
  userEmail?: string | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

export function Header({
  currentMonth,
  monthTabs,
  onMonthChange,
  onAddTransaction,
  isConnected,
  userEmail,
  onSignOut,
  onSignIn,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container flex min-h-[64px] flex-wrap items-center justify-between gap-2 px-3 py-2 md:h-16 md:flex-nowrap md:px-6 md:py-0">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Hamburger Menu - Mobile Only */}
          <SheetComponent open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-16 w-16 md:hidden">
                <Menu className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Wallet className="h-4 w-4 text-primary-foreground" />
                  </div>
                  ExpenseTracker
                </SheetTitle>
                <SheetDescription>
                  Manage your expenses with Google Sheets
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {/* Connection Status */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
                  {isConnected && userEmail ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Sheet className="h-4 w-4" />
                        <span className="font-medium">Connected to Google Sheets</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">{userEmail}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-muted bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Cloud className="h-4 w-4" />
                        <span className="font-medium">Demo Mode</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Connect to sync with Google Sheets
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        onAddTransaction();
                        setMobileMenuOpen(false);
                      }} 
                      className="w-full justify-start gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Transaction
                    </Button>
                    
                    {isConnected && onSignOut && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          onSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-2"
                      >
                        Sign Out
                      </Button>
                    )}
                    
                    {!isConnected && onSignIn && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          onSignIn();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-2"
                      >
                        <Sheet className="h-4 w-4 text-green-600" />
                        Connect to Google Sheets
                      </Button>
                    )}
                  </div>
                </div>

                {/* Month Selector */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Select Month</h3>
                  <MonthSwitcher
                    currentMonth={currentMonth}
                    monthTabs={monthTabs}
                    onMonthChange={onMonthChange}
                    isConnected={isConnected}
                  />
                </div>
              </div>
            </SheetContent>
          </SheetComponent>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold block md:inline-block text-base md:text-lg">
              ExpenseTracker
            </span>
          </div>

          <div className="hidden h-6 w-px bg-border md:block" />

          <div className="hidden md:block">
            <MonthSwitcher
              currentMonth={currentMonth}
              monthTabs={monthTabs}
              onMonthChange={onMonthChange}
              isConnected={isConnected}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Desktop: Show status badges and buttons */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {isConnected && userEmail && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 md:gap-2 rounded-lg border border-border bg-card px-2 md:px-3 py-1.5 text-sm">
                      <Sheet className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-600" />
                      <User className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-left">
                      <div className="font-medium">Connected to Google Sheets</div>
                      <div className="text-xs text-muted-foreground">Signed in as {userEmail}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                {onSignOut && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSignOut}
                    className="h-8 text-xs md:text-sm px-2.5 md:px-3"
                  >
                    Sign Out
                  </Button>
                )}
              </>
            )}
            {!isConnected && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground">
                      <Cloud className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span className="hidden sm:inline">Demo</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Running in demo mode. Connect to Google Sheets to sync data.
                  </TooltipContent>
                </Tooltip>
                {onSignIn && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSignIn}
                    className="h-8 gap-1.5 px-2.5 md:px-3 text-xs md:text-sm"
                  >
                    <Sheet className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-600" />
                    <span>Connect</span>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile: Show only Add button (removed as per request) */}
          {/* <Button onClick={onAddTransaction} className="h-8 md:h-9 gap-1.5 md:gap-2 px-3 md:px-4 text-xs md:text-sm">
            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Add</span>
            <span className="hidden md:inline">Transaction</span>
          </Button> */}
        </div>

        {/* Mobile Month Switcher - Full Width on Second Row */}
        <div className="w-full md:hidden">
          <MonthSwitcher
            currentMonth={currentMonth}
            monthTabs={monthTabs}
            onMonthChange={onMonthChange}
            isConnected={isConnected}
          />
        </div>
      </div>
    </header>
  );
}
