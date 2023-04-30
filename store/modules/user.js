// Zustand module for user state management (includes auth token)
export const createUserSlice = (set) => ({
    user: null,
    userId: null,
    token: null,
    contacts: null,
    blocked: null,

    setUser: (user) => set({ user }),
    setUserId: (userId) => set({ userId }),
    setToken: (token) => set({ token }),
    setContacts: (contacts) => set({ contacts }),
    setBlocked: (blocked) => set({ blocked }),

    clearUser: () => set({ user: null }),
    clearUserId: () => set({ userId: null }),
    clearToken: () => set({ token: null }),
    clearContacts: () => set({ contacts: null }),
    clearBlocked: () => set({ blocked: null }),
});
