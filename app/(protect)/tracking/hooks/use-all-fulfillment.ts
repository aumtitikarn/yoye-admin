"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { EBookingStatus } from "../types/enum";
import { IBookingOrder } from "../types/interface";

export interface IFulfillmentQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: EBookingStatus;
}

export function useAllFulfillment(query?: IFulfillmentQuery) {
  return useQueryGet<IResponseWithPaginate<IBookingOrder[]>>(
    ["orders", query],
    "orders",
    query,
    { keepPreviousData: true },
  );
}
