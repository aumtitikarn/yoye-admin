"use client";

import { useMutationPatchWithPath } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";

interface IVerifyParam {
  id: number;
}

interface IRejectPayload {
  notes?: string;
}

interface IRejectParam {
  id: number;
  payload: IRejectPayload;
}

export function useVerifyPayment() {
  return useMutationPatchWithPath<IBaseResponse, Record<string, never>, IVerifyParam>(
    ({ id }) => `payment-slips/${id}/verify`,
    () => ({}),
  );
}

export function useRejectPayment() {
  return useMutationPatchWithPath<IBaseResponse, IRejectPayload, IRejectParam>(
    ({ id }) => `payment-slips/${id}/reject`,
    ({ payload }) => payload,
  );
}
