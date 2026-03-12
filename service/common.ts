import { axiosInstance } from "@/lib/axios";

// GET
export const apiGet = async <TRes>(
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Record<string, any>,
): Promise<TRes> => {
  const res = await axiosInstance.get<TRes>(path, {
    params: query,
  });
  return res.data;
};

// POST
export const apiPost = async <TRes, TReq>(
  path: string,
  body?: TReq,
): Promise<TRes> => {
  const config =
    body instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const res = await axiosInstance.post<TRes>(path, body, config);
  return res.data;
};

// PATCH
export const apiPatch = async <TRes, TReq>(
  path: string,
  body?: TReq,
): Promise<TRes> => {
  const config =
    body instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const res = await axiosInstance.patch<TRes>(path, body, config);
  return res.data;
};

// DELETE
export const apiDelete = async <TRes>(path: string): Promise<TRes> => {
  const res = await axiosInstance.delete<TRes>(path);
  return res.data;
};
