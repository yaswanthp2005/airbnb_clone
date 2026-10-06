"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getHealth,
  getHealthNotFound,
  postHealthEcho,
  type HealthEchoPayload,
} from "@/api/health";
import { queryKeys } from "@/constants/queryKeys";

export const useHealthQuery = () =>
  useQuery({
    queryKey: queryKeys.health.status(),
    queryFn: getHealth,
  });

export const useHealthEchoMutation = () =>
  useMutation({
    mutationFn: (payload: HealthEchoPayload) => postHealthEcho(payload),
  });

export const useHealthErrorDemoMutation = () =>
  useMutation({
    mutationFn: getHealthNotFound,
  });
