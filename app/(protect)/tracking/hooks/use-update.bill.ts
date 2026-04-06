"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutationPatch } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";
import { EFulfillmentType } from "../types/enum";
import { createBillSchema, CreateBillFormValues } from "../validate/bill.validate";

export interface IUpdateBillPayload {
  type: EFulfillmentType;
  serviceFee: number;
  shippingFee: number;
  vatServiceFee?: number;
  vatShippingFee?: number;
  note?: string;
}

export function useUpdateBillMutation(
  bookingId: number,
  options?: UseMutationOptions<IBaseResponse, unknown, IUpdateBillPayload>,
) {
  return useMutationPatch<IBaseResponse, IUpdateBillPayload>(
    `orders/${bookingId}/bill`,
    options,
  );
}

export function useUpdateBill(bookingId: number) {
  const queryClient = useQueryClient();
  const form = useForm<CreateBillFormValues>({
    resolver: zodResolver(createBillSchema),
    defaultValues: {
      type: EFulfillmentType.PICKUP,
      serviceFee: 0,
      shippingFee: 0,
      vatServiceFee: 0,
      vatShippingFee: 0,
      note: "",
    },
  });

  const mutation = useUpdateBillMutation(bookingId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("อัปเดตบิลสำเร็จ", { position: "top-center" });
      form.reset();
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
      vatServiceFee: values.vatServiceFee,
      vatShippingFee: values.vatShippingFee,
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
