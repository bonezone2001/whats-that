// Zustand module for app state management
export const createAppSlice = (set) => ({
    bottomSheet: null,
    setBottomSheet: (bottomSheet) => set({ bottomSheet }),
    clearBottomSheet: () => set({ bottomSheet: null }),
});
