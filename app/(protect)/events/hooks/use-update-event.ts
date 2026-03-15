"use client";

import { useMutationPatch } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { TicketEventValues, FormEventValues } from "../create/validate/create-event.validate";

export function useUpdateTicketEvent(id: string | number) {
  return useMutationPatch<
    IBaseResponseData<unknown>,
    Omit<TicketEventValues, "type">
  >(`events/ticket/${id}`);
}

export function useUpdateFormEvent(id: string | number) {
  return useMutationPatch<
    IBaseResponseData<unknown>,
    Omit<FormEventValues, "type">
  >(`events/form/${id}`);
}