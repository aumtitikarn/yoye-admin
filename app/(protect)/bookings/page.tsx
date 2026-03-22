"use client";

import { useState } from "react";
import { useBookings } from "./hooks/use-bookings";
import { useEvents } from "../events/hooks/use-events";
import { IBooking } from "./types/interface";
import { EBookingStatus } from "./types/enum";
import { BookingsFilter } from "./components/bookings-filter";
import { BookingsTable } from "./components/bookings-table";
import { BookingDetailDialog } from "./components/booking-detail-dialog";

export default function BookingManagement() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: bookingsData, isLoading } = useBookings({
    page,
    pageSize,
    search: search || undefined,
    eventId: selectedEventId === "all" ? undefined : Number(selectedEventId),
    status: selectedStatus === "all" ? undefined : (selectedStatus as EBookingStatus),
  });

  const { data: eventsData } = useEvents();

  const bookings = bookingsData?.data ?? [];
  const meta = bookingsData?.meta ?? bookingsData?.pagination;
  const events = eventsData?.data ?? [];

  const openBookingDetail = (booking: IBooking) => {
    setSelectedBookingId(booking.id);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Booking & Form Management
        </h1>
        <p className="text-gray-600">จัดการคิวและรายการทั้งหมดในระบบ</p>
      </div>

      <BookingsFilter
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        events={events}
        selectedEventId={selectedEventId}
        onEventChange={(value) => {
          setSelectedEventId(value);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(value) => {
          setSelectedStatus(value);
          setPage(1);
        }}
      />

      <BookingsTable
        bookings={bookings}
        isLoading={isLoading}
        meta={meta}
        page={page}
        onPageChange={setPage}
        onViewDetail={openBookingDetail}
      />

      <BookingDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        bookingId={selectedBookingId}
      />
    </div>
  );
}
