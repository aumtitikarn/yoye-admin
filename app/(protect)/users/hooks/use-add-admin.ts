"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutationPost } from "@/service/globalQuery";
import {
  addAdminSchema,
  AddAdminFormValues,
} from "../validate/add-admin.validate";
import { IBaseResponseData } from "@/types/globalType";

type AddAdminPayload = Omit<AddAdminFormValues, "confirmPassword">;

export function useAddAdmin(onSuccess?: () => void) {
  const form = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      line: "",
      phone: "",
    },
  });

  const email = form.watch("email");

  useEffect(() => {
    const prefix = email.split("@")[0] ?? "";
    form.setValue("password", prefix, { shouldValidate: true });
    form.setValue("confirmPassword", prefix, { shouldValidate: true });
  }, [email, form]);

  const mutation = useMutationPost<
    IBaseResponseData<AddAdminPayload>,
    AddAdminPayload
  >("auth/register", {
    onSuccess: () => {
      toast.success("เพิ่มแอดมินสำเร็จ", { position: "top-center" });
      form.reset();
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
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      line: values.line,
      phone: values.phone,
    });
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
}
