import { Input } from "@/components/ui/input";
import { SingleCombobox } from "@/components/ui/combobox";
import { Search } from "lucide-react";
import { EBookingStatus, BOOKING_STATUS_LABEL } from "../types/enum";
import { IBookingEvent } from "../types/interface";

interface BookingsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  events: IBookingEvent[];
  selectedEventId: string;
  onEventChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export function BookingsFilter({
  search,
  onSearchChange,
  events,
  selectedEventId,
  onEventChange,
  selectedStatus,
  onStatusChange,
}: BookingsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="ค้นหาชื่อลูกค้าหรือเลขที่คิว..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      <SingleCombobox
        options={[
          { value: "", label: "ทุกงาน" },
          ...events.map((event) => ({
            value: String(event.id),
            label: event.name,
          })),
        ]}
        value={selectedEventId === "all" ? "" : selectedEventId}
        onChange={(value) => onEventChange(value || "all")}
        placeholder="เลือกงาน"
        searchPlaceholder="ค้นหางาน..."
        emptyText="ไม่พบงาน"
        className="w-full sm:w-48"
      />
      <SingleCombobox
        options={[
          { value: "", label: "ทุกสถานะ" },
          ...Object.values(EBookingStatus).map((status) => ({
            value: status,
            label: BOOKING_STATUS_LABEL[status],
          })),
        ]}
        value={selectedStatus === "all" ? "" : selectedStatus}
        onChange={(value) => onStatusChange(value || "all")}
        placeholder="เลือกสถานะ"
        searchPlaceholder="ค้นหาสถานะ..."
        emptyText="ไม่พบสถานะ"
        className="w-full sm:w-48"
      />
    </div>
  );
}
