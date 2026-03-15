"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMutationDelete } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { toast } from "sonner";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutationDelete<IBaseResponseData<unknown>, number>(
    (id) => `events/${id}`,
    {
      onSuccess: () => {
        toast.success("ลบงานสำเร็จ", { position: "top-center" });
        queryClient.invalidateQueries({ queryKey: ["events"] });
      },
      onError: (error: unknown) => {
        try {
          const parsed = JSON.parse((error as Error).message);
          toast.error(parsed?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
        } catch {
          toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
      },
    },
  );
}