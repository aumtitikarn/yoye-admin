"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { IEventDetail } from "../types/interface";

export function useEventById(id: string | number) {
  return useQueryGet<IBaseResponseData<IEventDetail>>(
    ["events", id],
    `events/${id}`,
  );
}