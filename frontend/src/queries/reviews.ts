"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { postReview } from "@/api/reviews";
import { HTTP_STATUS } from "@/constants";
import { queryKeys } from "@/constants/queryKeys";
import type { CreateReviewInput } from "@/types/listing";
import { invalidateViewerData } from "@/utils/invalidateViewerData";

/**
 * A review changes the listing's reviews, rating and breakdown (`listings.all` covers the
 * reviews, detail and explore keys; wishlists and host stats show ratings too) and its trip.
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => postReview(input),
    onSuccess: () => {
      invalidateViewerData(queryClient);
    },
    onError: error => {
      // Already reviewed (e.g. in another tab): refresh the trip so the button goes away.
      if (isAxiosError(error) && error.response?.status === HTTP_STATUS.conflict) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      }
    },
  });
};
