import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Payload, User } from "../../types/auth";

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  authenticatedUser: User | null;
  setAuthenticatedUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      authenticatedUser: null,
      setAuthenticatedUser: (value: User | null) =>
        set(() => ({ authenticatedUser: value })),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, authenticatedUser: null }),
    }),
    {
      name: "auth-store", // Storage key name
      storage: createJSONStorage(() => localStorage), // Defaults to localStorage
    }
  )
);
