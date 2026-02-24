"use client";

import { useState } from "react";
import { EventHeader } from "./components/event-header";
import { EventsTable, EventItem } from "./components/events-table";

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
    },
    {
      id: "2",
      name: "Product Pre-order",
      type: "FORM",
      status: "ACTIVE",
      startDate: "2024-03-20",
      endDate: "2024-03-31",
      bookings: 23,
    },
    {
      id: "3",
      name: "Fan Meeting",
      type: "TICKET",
      status: "DRAFT",
      startDate: "2024-04-10",
      endDate: "2024-04-10",
      bookings: 0,
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [eventType, setEventType] = useState<"TICKET" | "FORM">("TICKET");

  return (
    <div className="space-y-6">
      <EventHeader
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        eventType={eventType}
        setEventType={setEventType}
      />

      <EventsTable events={events} />
    </div>
  );
}
