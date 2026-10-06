import { camelToSnake } from "@/utils/camelToSnake";

type PathParamValue = string | number | undefined | null;

export type BuildUrlOptions = {
  path: string;
  pathParams?: Record<string, PathParamValue>;
  query?: Record<string, unknown>;
};

const isEmptyQueryValue = (value: unknown): boolean =>
  value === null || value === undefined || value === "";

const appendQueryValue = (
  searchParams: URLSearchParams,
  key: string,
  value: unknown,
): void => {
  if (isEmptyQueryValue(value)) {
    return;
  }

  if (Array.isArray(value)) {
    const parts = value.filter(part => !isEmptyQueryValue(part)).map(String);
    if (parts.length > 0) {
      searchParams.set(key, parts.join(","));
    }
    return;
  }

  searchParams.set(key, String(value));
};

export const buildUrl = ({
  path,
  pathParams = {},
  query = {},
}: BuildUrlOptions): string => {
  let url = path;

  for (const [key, value] of Object.entries(pathParams)) {
    if (value !== undefined && value !== null) {
      url = url.replace(`:${key}`, encodeURIComponent(String(value)));
    }
  }

  const snakeQuery = camelToSnake(query) as Record<string, unknown>;
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(snakeQuery)) {
    appendQueryValue(searchParams, key, value);
  }

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};
