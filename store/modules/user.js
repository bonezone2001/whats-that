// Zustand module for user state management (includes auth token)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AsyncStorage } from "react-native";

export const createUserSlice = (set, get) => ({
    user: null,
    userId: null,
    token: null,

    setUser: (user) => set({ user }),
    setUserId: (userId) => set({ userId }),
    setToken: (token) => set({ token }),

    clearUser: () => set({ user: null }),
    clearUserId: () => set({ userId: null }),
    clearToken: () => set({ token: null }),
});