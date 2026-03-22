"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { IBookingDetail } from "../types/interface";

export function useBookingById(id: string | number | null) {
  return useQueryGet<IBaseResponseData<IBookingDetail>>(
    ["bookings", id],
    `bookings/${id}`,
    undefined,
    { enabled: !!id },
  );
}
