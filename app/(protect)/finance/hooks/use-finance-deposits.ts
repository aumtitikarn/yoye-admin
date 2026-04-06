"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { IDepositQuery, IDepositRecord } from "../types/interface";

export function useFinanceDeposits(query?: IDepositQuery) {
  return useQueryGet<IResponseWithPaginate<IDepositRecord[]>>(
    ["finance-deposits", query],
    "finance/deposits",
    query,
  );
}
