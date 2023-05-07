// Zustand module for chat state management.

export const createChatSlice = (set) => ({
    chats: null,
    drafts: {},

    setChats: (chats) => set({ chats }),
    setDrafts: (drafts) => set({ drafts }),

    clearChats: () => set({ chats: null }),
    clearDrafts: () => set({ drafts: {} }),
});
