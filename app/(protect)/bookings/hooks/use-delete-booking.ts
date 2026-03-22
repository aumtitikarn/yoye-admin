import { useMutationDelete } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";

export function useDeleteBooking() {
  return useMutationDelete<IBaseResponse, number>(
    (id) => `bookings/${id}`,
  );
}
