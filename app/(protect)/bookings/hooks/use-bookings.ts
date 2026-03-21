"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { IBooking, IBookingsQuery } from "../types/interface";

export function useBookings(query?: IBookingsQuery) {
  return useQueryGet<IResponseWithPaginate<IBooking[]>>(
    ["bookings", query],
    "bookings",
    query,
  );
}
