import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type { Destination } from "@/types/destination";

type DestinationsResponseBody = {
  data: Destination[];
};

export const getDestinations = async (): Promise<Destination[]> => {
  const { data } = await apiClient.get<DestinationsResponseBody>(apiRoutes.destinations);
  return data.data;
};
