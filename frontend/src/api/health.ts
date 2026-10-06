import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import { buildUrl } from "@/utils/buildUrl";

export type HealthStatus = {
  status: string;
  appName: string;
};

export type HealthEchoNestedItem = {
  innerValue: number;
};

export type HealthEchoPayload = {
  sampleField: string;
  nestedItems?: HealthEchoNestedItem[];
};

export type HealthEchoResponse = {
  data: HealthEchoPayload;
  message: string;
};

export const getHealth = async (): Promise<HealthStatus> => {
  const { data } = await apiClient.get<HealthStatus>(
    buildUrl({ path: apiRoutes.health }),
  );
  return data;
};

export const postHealthEcho = async (
  payload: HealthEchoPayload,
): Promise<HealthEchoResponse> => {
  const { data } = await apiClient.post<HealthEchoResponse>(
    buildUrl({ path: apiRoutes.healthEcho }),
    payload,
  );
  return data;
};

/** Triggers a 404 so interceptors can surface an error toast (dev/demo). */
export const getHealthNotFound = async (): Promise<never> => {
  await apiClient.get(buildUrl({ path: apiRoutes.healthNotFound }));
  throw new Error("Unreachable");
};
