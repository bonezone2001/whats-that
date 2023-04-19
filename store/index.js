import { createUserSlice } from "./modules/user";
import { create } from "zustand";

export const useStore = create((set, get) => ({
    ...createUserSlice(set, get),
}));