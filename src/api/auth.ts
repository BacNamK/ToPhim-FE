import api from "./http";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export const login = (payload: LoginPayload) => api.post("/login", payload);

export const register = (payload: RegisterPayload) =>
  api.post("/register", payload);
