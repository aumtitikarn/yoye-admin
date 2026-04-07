"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { ActivityItem } from "../types/interface";

export function useDashboardActivity(limit = 10) {
  return useQueryGet<IBaseResponseData<ActivityItem[]>>(
    ["dashboard", "activity", limit],
    "dashboard/activity",
    { limit },
  );
}
