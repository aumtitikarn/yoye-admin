"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { IFeeRecord, IFinanceFeesQuery } from "../types/interface";

export function useFinanceFees(query?: IFinanceFeesQuery) {
  return useQueryGet<IResponseWithPaginate<IFeeRecord[]>>(
    ["finance-fees", query],
    "finance/fees",
    query,
  );
}
