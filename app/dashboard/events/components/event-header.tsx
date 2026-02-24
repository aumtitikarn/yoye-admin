"use client";

import { Dispatch, SetStateAction } from "react";
import { CreateEventDialog } from "./create-event-dialog";

type EventHeaderProps = Readonly<{
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: Dispatch<SetStateAction<boolean>>;
  eventType: "TICKET" | "FORM";
  setEventType: Dispatch<SetStateAction<"TICKET" | "FORM">>;
}>;

export function EventHeader({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  eventType,
  setEventType,
}: EventHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <p className="text-gray-600">
          จัดการงานทั้งแบบ Ticket Mode และ Form Mode
        </p>
      </div>

      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        eventType={eventType}
        onEventTypeChange={setEventType}
      />
    </div>
  );
}
