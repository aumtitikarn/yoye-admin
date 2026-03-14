"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutationPost } from "@/service/globalQuery";
import {
  ticketEventSchema,
  formEventSchema,
  TicketEventValues,
  FormEventValues,
} from "../create/validate/create-event.validate";
import { IBaseResponseData } from "@/types/globalType";
import { toApiDate } from "../utils/date";

// ──────────────────────────────────────────────────────────────
// TICKET
// ──────────────────────────────────────────────────────────────

export function useCreateTicketEvent() {
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
        {
          name: "",
          date: "",
          time: "",
          zones: [{  name: "", price: "", fee: "", capacity: "" }],
        },
      ],
      deepInfoFields: [
        {  otherCode: "other1", label: "", isRequired: true },
      ],
    },
  });

  const mutation = useMutationPost<
    IBaseResponseData<unknown>,
    Omit<TicketEventValues, "type">
  >("events/ticket", {
    onSuccess: () => {
      toast.success("สร้างงานสำเร็จ", { position: "top-center" });
      form.reset();
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

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
}

// ──────────────────────────────────────────────────────────────
// FORM
// ──────────────────────────────────────────────────────────────

export function useCreateFormEvent() {
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
      deepInfoFields: [
        { otherCode: "other1", label: "", isRequired: true },
      ],
    },
  });

  const mutation = useMutationPost<
    IBaseResponseData<unknown>,
    Omit<FormEventValues, "type">
  >("events/form", {
    onSuccess: () => {
      toast.success("สร้างงานสำเร็จ", { position: "top-center" });
      form.reset();
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

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
}
