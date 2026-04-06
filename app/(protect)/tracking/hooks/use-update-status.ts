"use client";

import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutationPatch } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";
import { EBookingStatus, EDeliveryStatus } from "../types/enum";

export interface IUpdateOrderStatusPayload {
  status: EBookingStatus;
  note?: string;
}

export interface IUpdateDeliveryStatusPayload {
  deliveryStatus: EDeliveryStatus;
  note?: string;
}

export function useUpdateOrderStatusMutation(
  orderId: number,
  options?: UseMutationOptions<IBaseResponse, unknown, IUpdateOrderStatusPayload>,
) {
  return useMutationPatch<IBaseResponse, IUpdateOrderStatusPayload>(
    `orders/${orderId}/status`,
    options,
  );
}

export function useUpdateDeliveryStatusMutation(
  fulfillmentId: number,
  options?: UseMutationOptions<IBaseResponse, unknown, IUpdateDeliveryStatusPayload>,
) {
  return useMutationPatch<IBaseResponse, IUpdateDeliveryStatusPayload>(
    `orders/fulfillment/${fulfillmentId}/delivery-status`,
    options,
  );
}

export function useUpdateOrderStatus(orderId: number) {
  const queryClient = useQueryClient();

  const mutation = useUpdateOrderStatusMutation(orderId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("อัปเดตสถานะสำเร็จ", { position: "top-center" });
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

  return {
    isPending: mutation.isPending,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
  };
}

export function useUpdateDeliveryStatus(fulfillmentId: number) {
  const queryClient = useQueryClient();

  const mutation = useUpdateDeliveryStatusMutation(fulfillmentId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("อัปเดตสถานะจัดส่งสำเร็จ", { position: "top-center" });
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

  return {
    isPending: mutation.isPending,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
  };
}
