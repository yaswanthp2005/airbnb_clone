type UnauthorizedListener = () => void;

let unauthorizedListener: UnauthorizedListener | null = null;

export const setUnauthorizedListener = (
  listener: UnauthorizedListener | null,
): void => {
  unauthorizedListener = listener;
};

export const notifyUnauthorized = (): void => {
  unauthorizedListener?.();
};
