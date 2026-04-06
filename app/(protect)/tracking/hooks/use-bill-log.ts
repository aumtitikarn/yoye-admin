"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";
import { EFulfillmentType } from "../types/enum";

export interface IBillLogAdmin {
  id: number;
  firstName: string;
  lastName: string;
}

export interface IBillLog {
  id: number;
  fulfillmentId: number;
  adminId: number;
  action: "CREATE" | "EDIT";
  fulfillmentType: EFulfillmentType;
  serviceFee: number;
  shippingFee: number;
  vatServiceFee: number;
  vatShippingFee: number;
  vatAmount: number;
  totalCharge: number;
  note: string | null;
  createdAt: string;
  admin: IBillLogAdmin;
}

export interface IBillLogResponse extends IBaseResponse {
  data: IBillLog[];
}

export function useBillLog(bookingId: number) {
  return useQueryGet<IBillLogResponse>(
    ["bill-log", bookingId],
    `orders/${bookingId}/bill/history`,
    undefined,
    { enabled: bookingId > 0 },
  );
}
