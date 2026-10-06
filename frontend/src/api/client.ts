import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

import { t } from "@/common/i18n";
import { API_BASE_URL, HTTP_STATUS } from "@/constants";
import { camelToSnake } from "@/utils/camelToSnake";
import { notifyUnauthorized } from "@/utils/authEvents";
import { clearAuthSession } from "@/utils/authSession";
import { getAuthToken } from "@/utils/storage";
import { snakeToCamel } from "@/utils/snakeToCamel";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const isMutationMethod = (method: string | undefined): boolean => {
  const normalized = (method ?? "get").toLowerCase();
  return normalized !== "get" && normalized !== "head";
};

const transformRequestData = (data: unknown): unknown => {
  if (data instanceof FormData || data instanceof Blob) {
    return data;
  }
  if (data === undefined || data === null) {
    return data;
  }
  return camelToSnake(data);
};

const attachAuthHeader = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleSuccessResponse = (response: AxiosResponse): AxiosResponse => {
  if (response.data instanceof Blob) {
    return response;
  }

  if (response.data !== undefined && response.data !== null) {
    response.data = snakeToCamel(response.data);
  }

  const skipToast = response.config.skipToast;
  if (!skipToast && isMutationMethod(response.config.method)) {
    const body = response.data as { message?: string } | null;
    const message = body?.message ?? t("toast.successDefault");
    toast.success(message);
  }

  return response;
};

const getErrorMessage = (error: AxiosError<{ message?: string }>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message && error.code === "ERR_NETWORK") {
    return t("error.network");
  }

  return t("toast.errorDefault");
};

const handleErrorResponse = (error: AxiosError): Promise<never> => {
  if (error.response?.status === HTTP_STATUS.unauthorized) {
    const requestUrl = error.config?.url ?? "";
    const isAuthAttempt =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    clearAuthSession();

    if (!isAuthAttempt) {
      notifyUnauthorized();
    }
  }

  if (error.response?.data && !(error.response.data instanceof Blob)) {
    error.response.data = snakeToCamel(error.response.data);
  }

  if (!error.config?.skipToast) {
    toast.error(getErrorMessage(error as AxiosError<{ message?: string }>));
  }

  return Promise.reject(error);
};

if (typeof window !== "undefined") {
  apiClient.interceptors.request.use(config => {
    const nextConfig = attachAuthHeader(config);

    if (nextConfig.params) {
      nextConfig.params = transformRequestData(nextConfig.params);
    }

    if (nextConfig.data !== undefined) {
      nextConfig.data = transformRequestData(nextConfig.data);
    }

    return nextConfig;
  });

  apiClient.interceptors.response.use(
    handleSuccessResponse,
    handleErrorResponse,
  );
}

export default apiClient;
