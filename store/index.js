import { createUserSlice } from "./modules/user";
import { createAppSlice } from "./modules/app";
import { create } from "zustand";

export const useStore = create((set, get) => ({
    ...createUserSlice(set, get),
    ...createAppSlice(set, get),
}));