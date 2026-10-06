const SNAKE_TO_CAMEL = /_([a-z])/g;

export const snakeToCamelKey = (key: string): string =>
  key.replace(SNAKE_TO_CAMEL, (_, letter: string) => letter.toUpperCase());

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Date) &&
  !(value instanceof File) &&
  !(value instanceof Blob);

export const snakeToCamel = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => snakeToCamel(item)) as T;
  }

  if (!isPlainRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      snakeToCamelKey(key),
      snakeToCamel(nested),
    ]),
  ) as T;
};
