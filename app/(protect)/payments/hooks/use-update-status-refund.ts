"use client";

import { useMutationPatchWithPath } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";
import { RefundStatus } from "../types/enum";

export interface IUpdateRefundStatusPayload {
  status: RefundStatus;
  note?: string;
}

interface IUpdateRefundStatusParam {
  id: number;
  payload: IUpdateRefundStatusPayload;
}

export function useUpdateRefundStatus() {
  return useMutationPatchWithPath<IBaseResponse, IUpdateRefundStatusPayload, IUpdateRefundStatusParam>(
    ({ id }) => `refund-requests/${id}/status`,
    ({ payload }) => payload,
  );
}
