// Zustand module for chat state management
export const createChatSlice = (set, get) => ({
    chats: null,
    
    setChats: (chats) => set({ chats }),
    
    clearChats: () => set({ chats: null }),
});