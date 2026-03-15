"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useCreateTicketEvent,
  useCreateFormEvent,
} from "../hooks/use-create-event";
import { AddTicketForm } from "./components/add-ticket";
import { AddFormForm } from "./components/add-form";

export default function CreateEventPage() {
  const [eventType, setEventType] = useState<"TICKET" | "FORM">("TICKET");

  const {
    form: ticketForm,
    onSubmit: onTicketSubmit,
    isPending: isTicketPending,
  } = useCreateTicketEvent();

  const {
    form: formForm,
    onSubmit: onFormSubmit,
    isPending: isFormPending,
  } = useCreateFormEvent();

  const handleSubmit = eventType === "TICKET" ? onTicketSubmit : onFormSubmit;
  const isPending = eventType === "TICKET" ? isTicketPending : isFormPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/events">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">สร้างงานใหม่</h1>
            <p className="text-gray-600">เลือกรูปแบบงานและกรอกข้อมูลเพื่อสร้างงานใหม่</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border p-6">
        <Tabs
          value={eventType}
          onValueChange={(value) => setEventType(value as "TICKET" | "FORM")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="TICKET">Ticket Mode</TabsTrigger>
            <TabsTrigger value="FORM">Form Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="TICKET" className="mt-6">
            <AddTicketForm form={ticketForm} />
          </TabsContent>

          <TabsContent value="FORM" className="mt-6">
            <AddFormForm form={formForm} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Link href="/events">
              <Button type="button" variant="outline">
                ยกเลิก
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "กำลังสร้าง..." : "สร้างงาน"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}