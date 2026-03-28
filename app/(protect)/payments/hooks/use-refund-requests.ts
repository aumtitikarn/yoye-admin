"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { IRefundRequest, IRefundRequestQuery } from "../types/interface";

export function useRefundRequests(query?: IRefundRequestQuery) {
  return useQueryGet<IResponseWithPaginate<IRefundRequest[]>>(
    ["refund-requests", query],
    "refund-requests",
    query,
  );
}
