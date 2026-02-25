"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TimePickerProps = Readonly<{
  value?: string; // Format: "HH:mm"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: "true" | "false" | boolean;
}>;

export function TimePicker({
  value,
  onChange,
  placeholder = "เลือกเวลา",
  className,
  "aria-invalid": ariaInvalid,
}: TimePickerProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  // Generate time options from 00:00 to 23:59 with 30-minute intervals
  const timeOptions = React.useMemo(() => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
        options.push(`${hourStr}:${minuteStr}`);
      }
    }
    return options;
  }, []);

  const handleSelect = (selectedTime: string) => {
    onChange(selectedTime);
    setOpen(false);
  };

  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? "น." : "โมง";
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  return (
    <div className={className || ""}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal bg-white"
            aria-invalid={ariaInvalid}
          >
            {value ? formatTimeDisplay(value) : placeholder}
            <Clock className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="max-h-64 overflow-y-auto">
            {timeOptions.map((time) => (
              <button
                key={time}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer"
                onClick={() => handleSelect(time)}
              >
                {formatTimeDisplay(time)}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
