"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { AlertItem } from "../types/interface";

export function useDashboardAlerts(limit = 10) {
  return useQueryGet<IBaseResponseData<AlertItem[]>>(
    ["dashboard", "alerts", limit],
    "dashboard/alerts",
    { limit },
    { refetchInterval: 30_000 },
  );
}
