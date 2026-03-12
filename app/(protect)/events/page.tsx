"use client";

import { useState, useMemo } from "react";
import { EventHeader } from "./components/event-header";
import { EventsTable, EventItem } from "./components/events-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function EventManagement() {
  const [events] = useState<EventItem[]>([
    {
      id: "1",
      name: "Concert Night 2024",
      type: "TICKET",
      status: "ACTIVE",
      startDate: "2024-03-15",
      endDate: "2024-03-15",
      bookings: 45,
      totalCapacity: 100,
    },
    {
      id: "2",
      name: "Product Pre-order",
      type: "FORM",
      status: "ACTIVE",
      startDate: "2024-03-20",
      endDate: "2024-03-31",
      bookings: 23,
      totalCapacity: 50,
    },
    {
      id: "3",
      name: "Fan Meeting",
      type: "TICKET",
      status: "DRAFT",
      startDate: "2024-04-10",
      endDate: "2024-04-10",
      bookings: 0,
      totalCapacity: 200,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "TICKET" | "FORM">(
    "ALL",
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === "ALL" || event.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [events, searchTerm, filterType]);

  return (
    <div className="space-y-6">
      <EventHeader />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ค้นหาชื่องาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Select
          value={filterType}
          onValueChange={(value: "ALL" | "TICKET" | "FORM") =>
            setFilterType(value)
          }
        >
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="เลือกประเภทงาน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ทั้งหมด</SelectItem>
            <SelectItem value="TICKET">แบบตั๋ว</SelectItem>
            <SelectItem value="FORM">แบบฟอร์ม</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <EventsTable events={filteredEvents} />
    </div>
  );
}
