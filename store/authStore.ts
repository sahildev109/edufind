import { create } from "zustand";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AuthPayload = {
  accessToken: string;
  user: AuthUser;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setAuth: (payload: AuthPayload) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (payload) => set({ accessToken: payload.accessToken, user: payload.user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
