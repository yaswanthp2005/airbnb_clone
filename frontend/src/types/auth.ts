export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
};

export type AuthSessionPayload = {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
};

export type AuthMode = "login" | "register";
