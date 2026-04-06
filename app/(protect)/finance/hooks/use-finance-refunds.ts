"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { IFinanceRefundsQuery, IRefundRecord } from "../types/interface";

export function useFinanceRefunds(query?: IFinanceRefundsQuery) {
  return useQueryGet<IResponseWithPaginate<IRefundRecord[]>>(
    ["finance-refunds", query],
    "finance/refunds",
    query,
  );
}
