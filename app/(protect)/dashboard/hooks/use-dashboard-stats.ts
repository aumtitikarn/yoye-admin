"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { DashboardStats } from "../types/interface";

export function useDashboardStats() {
  return useQueryGet<IBaseResponseData<DashboardStats>>(
    ["dashboard", "stats"],
    "dashboard/stats",
    undefined,
    { refetchInterval: 30_000 },
  );
}
