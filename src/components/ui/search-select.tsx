import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "./command";

interface SearchSelectProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  iconMap?: Record<string, any>;
}

export function SearchSelect({ options, value, onChange, placeholder, iconMap }: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <button
        type="button"
        className="w-full h-10 px-3 py-2 border rounded-md text-left bg-background"
        onClick={() => setOpen(true)}
      >
        {value || placeholder || "Select..."}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover rounded-md shadow-lg border">
          <Command>
            <CommandInput
              placeholder={placeholder || "Search..."}
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {filtered.map((option) => {
                const Icon = iconMap?.[option];
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      onChange(option);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {Icon && (
                      <Icon className="h-4 w-4 mr-2" />
                    )}
                    {option}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
