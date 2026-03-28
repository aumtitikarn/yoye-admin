"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IResponseWithPaginate } from "@/types/globalType";
import { IPaymentSlip, IPaymentSlipQuery } from "../types/interface";

export function useAllPayments(query?: IPaymentSlipQuery) {
  return useQueryGet<IResponseWithPaginate<IPaymentSlip[]>>(
    ["payment-slips", query],
    "payment-slips",
    query,
  );
}
