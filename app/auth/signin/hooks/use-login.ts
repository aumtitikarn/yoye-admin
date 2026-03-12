"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutationPost } from "@/service/globalQuery";
import {
  LoginFormValues,
  loginSchema,
} from "../validate/login.validate";
import { IBaseResponseData } from "@/types/globalType";

interface LoginResponse {
  access_token: string;
}

export function useLogin() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutationPost<
    IBaseResponseData<LoginResponse>,
    LoginFormValues
  >("auth/login", {
    onSuccess: (res) => {
      const token = res?.data?.access_token;
      if (token) {
        document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      toast.success("เข้าสู่ระบบสำเร็จ", { position: "top-center" });
      form.reset();
      router.push("/dashboard");
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
