import { create } from 'zustand';

import { createChatSlice } from './modules/chat';
import { createUserSlice } from './modules/user';
import { createAppSlice } from './modules/app';

export const useStore = create((set, get) => ({
    ...createUserSlice(set, get),
    ...createAppSlice(set, get),
    ...createChatSlice(set, get),
}));
