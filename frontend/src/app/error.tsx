"use client";

import ErrorFallback, { type ErrorBoundaryProps } from "@/components/common/ErrorFallback";

export default function Error(props: ErrorBoundaryProps) {
  return <ErrorFallback {...props} />;
}
