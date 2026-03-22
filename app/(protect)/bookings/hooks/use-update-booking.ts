import { useMutationPatchWithPath } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";
import { EBookingStatus } from "../types/enum";

export interface IUpdateBookingPayload {
  status: EBookingStatus;
  notes?: string;
}

interface IUpdateBookingParam {
  id: number;
  payload: IUpdateBookingPayload;
}

export function useUpdateBooking() {
  return useMutationPatchWithPath<IBaseResponse, IUpdateBookingPayload, IUpdateBookingParam>(
    ({ id }) => `bookings/${id}`,
    ({ payload }) => payload,
  );
}
