"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutationDelete } from "@/service/globalQuery";
import { IBaseResponse } from "@/types/globalType";

export function useDeleteUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutationDelete<IBaseResponse, number>(
    (id) => `users/${id}`,
    {
      onSuccess: () => {
        toast.success("ลบบัญชีแอดมินสำเร็จ", { position: "top-center" });
        queryClient.invalidateQueries({ queryKey: ["all-users"] });
        onSuccess?.();
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

  return {
    deleteUser: mutation.mutate,
    isPending: mutation.isPending,
  };
}
