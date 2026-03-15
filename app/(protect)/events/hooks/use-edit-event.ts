"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutationPatch } from "@/service/globalQuery";
import {
  ticketEventSchema,
  formEventSchema,
  TicketEventValues,
  FormEventValues,
} from "../create/validate/create-event.validate";
import { IBaseResponseData } from "@/types/globalType";
import { IEventDetail } from "../types/interface";
import { toApiDate, fromApiDate } from "../utils/date";

// ──────────────────────────────────────────────────────────────
// TICKET
// ──────────────────────────────────────────────────────────────

export function useEditTicketEvent(id: string | number, event?: IEventDetail) {
  const router = useRouter();

  const form = useForm<TicketEventValues>({
    resolver: zodResolver(ticketEventSchema),
    defaultValues: {
      type: "TICKET",
      name: "",
      posterImage: "",
      posterUrl: "",
      notes: "",
      status: true,
      showRounds: [
        { name: "", date: "", time: "", zones: [{ name: "", price: "", fee: "", capacity: "" }] },
      ],
      deepInfoFields: [{ otherCode: "other1", label: "", isRequired: true }],
    },
  });

  useEffect(() => {
    if (!event) return;
    form.reset({
      type: "TICKET",
      name: event.name,
      posterImage: event.posterImage ?? "",
      posterUrl: event.posterUrl ?? "",
      notes: event.notes ?? "",
      status: event.status,
      showRounds: event.showRounds.map((round) => ({
        name: round.name,
        date: fromApiDate(round.date),
        time: round.time,
        zones: round.zones.map((zone) => ({
          name: zone.name,
          price: zone.price,
          fee: zone.fee,
          capacity: String(zone.capacity),
        })),
      })),
      deepInfoFields: event.deepInfoFields.map((field) => ({
        otherCode: field.otherCode,
        label: field.label,
        isRequired: field.isRequired,
      })),
    });
  }, [event, form]);

  const mutation = useMutationPatch<
    IBaseResponseData<unknown>,
    Omit<TicketEventValues, "type">
  >(`events/ticket/${id}`, {
    onSuccess: () => {
      toast.success("แก้ไขงานสำเร็จ", { position: "top-center" });
      router.push("/events");
    },
    onError: (error: unknown) => {
      try {
        const parsed = JSON.parse((error as Error).message);
        toast.error(parsed?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      } catch {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type: _type, ...payload } = values;
    mutation.mutate({
      ...payload,
      showRounds: payload.showRounds.map((round) => ({
        ...round,
        date: toApiDate(round.date),
      })),
    });
  });

  return { form, onSubmit, isPending: mutation.isPending };
}

// ──────────────────────────────────────────────────────────────
// FORM
// ──────────────────────────────────────────────────────────────

export function useEditFormEvent(id: string | number, event?: IEventDetail) {
  const router = useRouter();

  const form = useForm<FormEventValues>({
    resolver: zodResolver(formEventSchema),
    defaultValues: {
      type: "FORM",
      name: "",
      eventDate: "",
      feePerEntry: "",
      capacity: "",
      notes: "",
      posterImage: "",
      posterUrl: "",
      status: true,
      deepInfoFields: [{ otherCode: "other1", label: "", isRequired: true }],
    },
  });

  useEffect(() => {
    if (!event) return;
    form.reset({
      type: "FORM",
      name: event.name,
      eventDate: fromApiDate(event.eventDate),
      feePerEntry: event.feePerEntry ?? "",
      capacity: event.capacity != null ? String(event.capacity) : "",
      notes: event.notes ?? "",
      posterImage: event.posterImage ?? "",
      posterUrl: event.posterUrl ?? "",
      status: event.status,
      deepInfoFields: event.deepInfoFields.map((field) => ({
        otherCode: field.otherCode,
        label: field.label,
        isRequired: field.isRequired,
      })),
    });
  }, [event, form]);

  const mutation = useMutationPatch<
    IBaseResponseData<unknown>,
    Omit<FormEventValues, "type">
  >(`events/form/${id}`, {
    onSuccess: () => {
      toast.success("แก้ไขงานสำเร็จ", { position: "top-center" });
      router.push("/events");
    },
    onError: (error: unknown) => {
      try {
        const parsed = JSON.parse((error as Error).message);
        toast.error(parsed?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      } catch {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type: _type, ...payload } = values;
    mutation.mutate({
      ...payload,
      eventDate: toApiDate(payload.eventDate),
    });
  });

  return { form, onSubmit, isPending: mutation.isPending };
}