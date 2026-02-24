"use client";

import * as React from "react";
import { type DayPicker } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = Readonly<{
  value?: string; // Format: "DD/MM/YYYY"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: "true" | "false" | boolean;
  disabled?: React.ComponentProps<typeof DayPicker>["disabled"];
}>;

// Convert "DD/MM/YYYY" string to Date object
function parseDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  const parts = dateString.split("/");
  if (parts.length !== 3) return undefined;
  const day = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10) - 1;
  const year = Number.parseInt(parts[2], 10);
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return undefined;
  }
  return new Date(year, month, day);
}

// Convert Date object to "DD/MM/YYYY" string
function formatDate(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "เลือกวันที่",
  className,
  "aria-invalid": ariaInvalid,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const date = value ? parseDate(value) : undefined;
  const [month, setMonth] = React.useState<Date | undefined>(date);

  // Sync month when value prop changes
  React.useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      if (parsed) {
        setMonth(parsed);
      }
    }
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      onChange(formatted);
      setOpen(false);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className || ""}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal bg-white"
            aria-invalid={ariaInvalid}
          >
            {date
              ? date.toLocaleDateString("th-TH", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : placeholder}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            month={month}
            onMonthChange={setMonth}
            captionLayout="dropdown"
            onSelect={handleSelect}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
