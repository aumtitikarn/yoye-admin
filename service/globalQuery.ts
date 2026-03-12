import { apiDelete, apiGet, apiPatch, apiPost } from "./common";

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

// GET hook
export function useQueryGet<TRes, TSelect = TRes>(
  key: string | readonly unknown[],
  path: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<TRes, unknown, TSelect, readonly unknown[]>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<TRes, unknown, TSelect>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => apiGet<TRes>(path, query),
    ...options,
  });
}

// GET hook
// export function useQueryGet<TRes>(
//   key: string | readonly unknown[],
//   path: string,
//   query?: Record<string, any>,
//   options?: UseQueryOptions<TRes, unknown, TRes>,
// ) {
//   return useQuery<TRes, unknown, TRes>({
//     queryKey: Array.isArray(key) ? key : [key],
//     queryFn: () => apiGet<TRes>(path, query),
//     ...options,
//   });
// }

// POST mutation
export function useMutationPost<TRes, TReq = any>(
  path: string,
  options?: UseMutationOptions<TRes, unknown, TReq>,
) {
  return useMutation<TRes, unknown, TReq>({
    mutationFn: (payload: TReq) => apiPost<TRes, TReq>(path, payload),
    ...options,
  });
}

// PATCH mutation
export function useMutationPatch<TRes, TReq = any>(
  path: string,
  options?: UseMutationOptions<TRes, unknown, TReq>,
) {
  return useMutation<TRes, unknown, TReq>({
    mutationFn: (payload: TReq) => apiPatch<TRes, TReq>(path, payload),
    ...options,
  });
}

// PATCH mutation (dynamic path + payload mapping)
export function useMutationPatchWithPath<TRes, TReq, TParam>(
  path: (param: TParam) => string,
  mapPayload: (param: TParam) => TReq,
  options?: UseMutationOptions<TRes, unknown, TParam>,
) {
  return useMutation<TRes, unknown, TParam>({
    mutationFn: (param: TParam) =>
      apiPatch<TRes, TReq>(path(param), mapPayload(param)),
    ...options,
  });
}

// DELETE mutation
export function useMutationDelete<TRes, TParam = void>(
  path: string | ((param: TParam) => string),
  options?: UseMutationOptions<TRes, unknown, TParam>,
) {
  return useMutation<TRes, unknown, TParam>({
    mutationFn: (param: TParam) => {
      const finalPath = typeof path === "function" ? path(param) : path;
      return apiDelete<TRes>(finalPath);
    },
    ...options,
  });
}
