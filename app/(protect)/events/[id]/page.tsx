"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEventById } from "../hooks/use-events-byId";
import { useEditTicketEvent, useEditFormEvent } from "../hooks/use-edit-event";
import { AddTicketForm } from "../create/components/add-ticket";
import { AddFormForm } from "../create/components/add-form";
import { IEventDetail } from "../types/interface";

type Props = {
  params: Promise<{ id: string }>;
};

function EditTicketContent({ id, event }: { id: string; event: IEventDetail }) {
  const { form, onSubmit, isPending } = useEditTicketEvent(id, event);
  return (
    <>
      <AddTicketForm form={form} />
      <div className="flex-shrink-0 border-t pt-4 mt-6">
        <div className="flex justify-end gap-2">
          <Link href="/events">
            <Button type="button" variant="outline">ยกเลิก</Button>
          </Link>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </div>
    </>
  );
}

function EditFormContent({ id, event }: { id: string; event: IEventDetail }) {
  const { form, onSubmit, isPending } = useEditFormEvent(id, event);
  return (
    <>
      <AddFormForm form={form} />
      <div className="flex-shrink-0 border-t pt-4 mt-6">
        <div className="flex justify-end gap-2">
          <Link href="/events">
            <Button type="button" variant="outline">ยกเลิก</Button>
          </Link>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function EditEventPage({ params }: Props) {
  const { id } = use(params);
  const { data, isLoading } = useEventById(id);

  const event = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">แก้ไขงาน</h1>
          <p className="text-gray-600">{event?.name ?? `#${id}`}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        {isLoading || !event ? (
          <p className="text-gray-500">กำลังโหลดข้อมูลงาน...</p>
        ) : event.type === "TICKET" ? (
          <EditTicketContent id={id} event={event} />
        ) : (
          <EditFormContent id={id} event={event} />
        )}
      </div>
    </div>
  );
}