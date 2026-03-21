"use client";

import * as React from "react";
import { Check, ChevronsUpDown} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type SingleComboboxOption = {
  value: string;
  label: string;
  type?: "group" | "item";
  isSubcategory?: boolean;
  disabled?: boolean;
  imageUrl?: string;
  hasImage?: boolean;
  colorCode?: string;
};

type SingleComboboxProps = {
  options: SingleComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: "true" | "false" | boolean;
};

export function SingleCombobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled,
  className,
  "aria-invalid": ariaInvalid,
}: Readonly<SingleComboboxProps>) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find(
    (o) => o.type !== "group" && o.value === value,
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            "w-full justify-between overflow-hidden bg-white",
            className,
          )}
        >
          <span
            className={cn(
              "truncate flex-1 text-left flex items-center gap-2",
              !selectedOption && "text-muted-foreground",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />

          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>{emptyText}</CommandEmpty>

            {options.map((option, index) => {
              // 🔹 Header (หมวดหมู่หลัก – ไม่ selectable)
              if (option.type === "group") {
                return (
                  <div
                    key={option.value}
                    className="sticky top-0 z-10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted/60 border-b border-border/50"
                  >
                    {option.label}
                  </div>
                );
              }

              // 🔹 Item (subcategories or categories without children)
              const isSelected = value === option.value;
              const isDisabled = option.disabled ?? false;

              // Check if this item is a subcategory (use isSubcategory property or check previous option)
              const previousOption = index > 0 ? options[index - 1] : null;
              const isSubcategory =
                option.isSubcategory ?? previousOption?.type === "group";

              return (
                <CommandItem
                  key={option.value}
                  value={`${option.value}-${option.label}`}
                  onSelect={() => {
                    if (!isDisabled) {
                      // ถ้าเลือกอยู่แล้ว ให้ลบออก (clear selection)
                      if (isSelected) {
                        onChange("");
                      } else {
                        onChange(option.value);
                      }
                      setOpen(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "flex items-center justify-between px-3 py-2",
                    isSubcategory && "pl-6",
                    isSelected && "bg-accent",
                    isDisabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className={cn(
                        "text-sm truncate",
                        isSubcategory && "text-foreground",
                        isDisabled && "text-muted-foreground",
                      )}
                    >
                      {isSubcategory && (
                        <span className="mr-2 text-muted-foreground/50">└</span>
                      )}
                      {option.label}
                    </span>
                  </div>

                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isSelected ? "opacity-100 text-primary" : "opacity-0",
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
