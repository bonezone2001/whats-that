import { create } from 'zustand';

import { createChatSlice } from './modules/store_chat';
import { createUserSlice } from './modules/store_user';
import { createAppSlice } from './modules/store_app';

export const useStore = create((set, get) => ({
    ...createUserSlice(set, get),
    ...createAppSlice(set, get),
    ...createChatSlice(set, get),
}));
