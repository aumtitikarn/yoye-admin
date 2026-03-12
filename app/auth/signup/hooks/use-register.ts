"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutationPost } from "@/service/globalQuery";
import {
  RegisterFormValues,
  registerSchema,
} from "../validate/register.validate";
import { IBaseResponseData } from "@/types/globalType";

type RegisterPayload = Omit<RegisterFormValues, "confirmPassword">;

export function useRegister() {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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

  const mutation = useMutationPost<
    IBaseResponseData<RegisterPayload>,
    RegisterPayload
  >("auth/register", {
    onSuccess: () => {
      toast.success("สมัครสมาชิกสำเร็จ", { position: "top-center" });
      form.reset();
      router.push("/auth/signin");
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
    isSuccess: mutation.isSuccess,
    error: mutation.error as { message: string } | null,
    data: mutation.data?.data ?? null,
  };
}
