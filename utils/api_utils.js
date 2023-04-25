import { useStore } from "@store";
import api from "@api";

export const apiUtils = {
    updateContacts: async () => {
        const store = useStore.getState();
        const response = await api.getContacts();
        await store.setContacts(response.data);
    },
    
    updateBlocked: async () => {
        const store = useStore.getState();
        const response = await api.getBlockedUsers();
        await store.setBlocked(response.data);
    },

    updateContactsAndBlocked: async () => {
        await apiUtils.updateContacts();
        await apiUtils.updateBlocked();
    },

    updateChats: async () => {
        const store = useStore.getState();
        const response = await api.getAllChats();
        await store.setChats(response.data);
    }
};