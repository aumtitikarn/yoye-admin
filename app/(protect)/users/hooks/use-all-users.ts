"use client";

import { useQueryGet } from "@/service/globalQuery";
import { IBaseResponseData } from "@/types/globalType";
import { AdminUserAPI } from "../types";

export function useAllUsers() {
  return useQueryGet<IBaseResponseData<AdminUserAPI[]>>(
    "all-users",
    "users",
  );
}
