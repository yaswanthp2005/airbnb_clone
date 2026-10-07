const CAMEL_TO_SNAKE = /[A-Z]/g;

const camelToSnakeKey = (key: string): string =>
  key.replace(CAMEL_TO_SNAKE, letter => `_${letter.toLowerCase()}`);

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Date) &&
  !(value instanceof File) &&
  !(value instanceof Blob) &&
  !(value instanceof FormData);

export const camelToSnake = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => camelToSnake(item)) as T;
  }

  if (!isPlainRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      camelToSnakeKey(key),
      camelToSnake(nested),
    ]),
  ) as T;
};
