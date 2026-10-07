import apiClient from "@/api/client";
import { apiRoutes } from "@/constants/routes";
import type { CreatedReview, CreateReviewInput } from "@/types/review";

type ReviewResponseBody = {
  data: CreatedReview;
};

export const postReview = async (input: CreateReviewInput): Promise<CreatedReview> => {
  const { data } = await apiClient.post<ReviewResponseBody>(apiRoutes.reviews, input);
  return data.data;
};
