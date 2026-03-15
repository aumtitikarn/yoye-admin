"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { IEvent } from "../types/interface";
import { EEventType } from "../types/enum";

interface IEventsQuery {
  type?: EEventType;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useEvents(query?: IEventsQuery) {
  return useQueryGet<IResponseWithPaginate<IEvent[]>>(
    ["events", query],
    "events",
    query,
  );
}