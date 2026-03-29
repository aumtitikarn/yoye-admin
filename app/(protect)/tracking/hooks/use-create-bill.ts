"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutationPost } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";
import { EFulfillmentType } from "../types/enum";
import { createBillSchema, CreateBillFormValues } from "../validate/bill.validate";

export interface ICreateBillPayload {
  type: EFulfillmentType;
  serviceFee: number;
  shippingFee: number;
  note?: string;
}

export function useCreateBillMutation(
  bookingId: number,
  options?: UseMutationOptions<IBaseResponse, unknown, ICreateBillPayload>,
) {
  return useMutationPost<IBaseResponse, ICreateBillPayload>(
    `orders/${bookingId}/bill`,
    options,
  );
}

export function useCreateBill(bookingId: number) {
  const form = useForm<CreateBillFormValues>({
    resolver: zodResolver(createBillSchema),
    defaultValues: {
      type: EFulfillmentType.PICKUP,
      serviceFee: 0,
      shippingFee: 0,
      note: "",
    },
  });

  const mutation = useCreateBillMutation(bookingId, {
    onSuccess: () => {
      toast.success("สร้างบิลสำเร็จ", { position: "top-center" });
      form.reset({
        type: EFulfillmentType.PICKUP,
        serviceFee: 0,
        shippingFee: 0,
        note: "",
      });
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
    mutation.mutate({
      type: values.type,
      serviceFee: values.serviceFee,
      shippingFee: values.shippingFee ?? 0,
      note: values.note,
    });
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
  };
}
