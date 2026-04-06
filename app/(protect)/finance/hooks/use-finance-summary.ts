"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { IFinanceSummary } from "../types/interface";

export function useFinanceSummary() {
  return useQueryGet<IBaseResponseData<IFinanceSummary>>(
    ["finance-summary"],
    "finance/summary",
  );
}
