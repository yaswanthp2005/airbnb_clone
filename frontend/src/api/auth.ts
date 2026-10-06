import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type { AuthSessionPayload, AuthUser } from "@/types/auth";
import { buildUrl } from "@/utils/buildUrl";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthResponseBody = {
  data: AuthSessionPayload;
  message: string;
};

type MeResponseBody = {
  data: AuthUser;
};

export const postRegister = async (
  payload: RegisterPayload,
): Promise<AuthSessionPayload> => {
  const { data } = await apiClient.post<AuthResponseBody>(
    buildUrl({ path: apiRoutes.authRegister }),
    payload,
  );
  return data.data;
};

export const postLogin = async (
  payload: LoginPayload,
): Promise<AuthSessionPayload> => {
  const { data } = await apiClient.post<AuthResponseBody>(
    buildUrl({ path: apiRoutes.authLogin }),
    payload,
  );
  return data.data;
};

export const getMe = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get<MeResponseBody>(
    buildUrl({ path: apiRoutes.authMe }),
    { skipToast: true },
  );
  return data.data;
};
