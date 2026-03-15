"use client";

import { useState } from "react";
import { EventHeader } from "./components/event-header";
import { EventsTable } from "./components/events-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useEvents } from "./hooks/use-events";
import { EEventType } from "./types/enum";

export default function EventManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | EEventType>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useEvents({
    search: searchQuery || undefined,
    type: filterType === "ALL" ? undefined : filterType,
    page,
    pageSize: 10,
  });

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
            onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchTerm)}
            className="pl-10 bg-white"
          />
        </div>
        <Select
          value={filterType}
          onValueChange={(value: "ALL" | EEventType) => setFilterType(value)}
        >
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="เลือกประเภทงาน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ทั้งหมด</SelectItem>
            <SelectItem value={EEventType.TICKET}>แบบตั๋ว</SelectItem>
            <SelectItem value={EEventType.FORM}>แบบฟอร์ม</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">กำลังโหลด...</div>
      ) : (
        <EventsTable
          events={data?.data ?? []}
          pagination={data?.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}