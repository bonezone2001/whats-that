import Constants from 'expo-constants';
import { useStore } from '@store';
import axios from 'axios';

const API_BASE_URL = Constants.manifest.extra.API_BASE_URL;

// Create api client
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add the authorization header to all requests (if the user is logged in)
api.interceptors.request.use(
    async (config) => {
        const store = useStore.getState();
        if (store.token) config.headers['X-Authorization'] = store.token;
        return config;
    }
);

export default {
    // Auth
    login: async (email, password) => {
        const response = await api.post('/login', { email, password });
        return response;
    },
    register: async (first_name, last_name, email, password) => {
        const response = await api.post('/user', { first_name, last_name, email, password });
        return response;
    },
    logout: async () => {
        const response = await api.post('/logout');
        return response;
    },
    testAuth: async (token) => {
        const response = await api.get('/contacts', { headers: { 'X-Authorization': token } });
        return response;
    },

    // User
    getUserInfo: async (userId) => {
        const response = await api.get(`/user/${userId}`);
        return response;
    },
    updateUserInfo: async (userId, details) => {
        const response = await api.patch(`/user/${userId}`, details);
        return response;
    },
    getUserPhoto: async (userId) => {
        const response = await api.get(`/user/${userId}/photo`);
        return response;
    },
    uploadUserPhoto: async (photo) => {
        const response = await api.post(`/user/${userId}/photo`, photo);
        return response;
    },
    searchUsers: async (query, search_in, limit = 20, offset = 0) => {
        const response = await api.get(`/search?q=${query}&search_in=${search_in}&limit=${limit}&offset=${offset}`);
        return response;
    },

    // Contacts
    getContacts: async () => {
        const response = await api.get('/contacts');
        return response;
    },
    addContact: async (userId) => {
        const response = await api.post(`/contacts/${userId}`);
        return response;
    },
    removeContact: async (userId) => {
        const response = await api.delete(`/contacts/${userId}`);
        return response;
    },

    // Block
    getBlockedUsers: async () => {
        const response = await api.get('/blocked');
        return response;
    },
    blockUser: async (userId) => {
        const response = await api.post(`/user/${userId}/block`);
        return response;
    },
    unblockUser: async (userId) => {
        const response = await api.delete(`/user/${userId}/block`);
        return response;
    },

    // Chats
    getChatDetails: async (chatId, limit = 20, offset = 0) => {
        const response = await api.get(`/chat/${chatId}?limit=${limit}&offset=${offset}`);
        return response;
    },
    getAllChats: async () => {
        const response = await api.get('/chat');
        return response;
    },
    createChat: async (name) => {
        const response = await api.post('/chat', { name });
        return response;
    },
    updateChat: async (chatId, name) => {
        const response = await api.patch(`/chat/${chatId}`, { name });
        return response;
    },
    deleteChat: async (chatId) => {
        const response = await api.delete(`/chat/${chatId}`);
        return response;
    },
    addUserToChat: async (chatId, userId) => {
        const response = await api.post(`/chat/${chatId}/user/${userId}`);
        return response;
    },
    removeUserFromChat: async (chatId, userId) => {
        const response = await api.delete(`/chat/${chatId}/user/${userId}`);
        return response;
    },
    createChatWithUsers: async (name, userIds) => {
        const { chat_id } = await createChat(name);
        for (const userId of userIds)
            await addUserToChat(chat_id, userId);
        return chat_id;
    },
    // idk if this will work
    leaveChat: async (chatId) => {
        const response = await api.delete(`/chat/${chatId}/user/self`);
        return response;
    },

    // Messages
    sendMessage: async (chatId, text) => {
        const response = await api.post(`/chat/${chatId}/message`, { text });
        return response;
    },
    editMessage: async (chatId, messageId, text) => {
        const response = await api.patch(`/chat/${chatId}/message/${messageId}`, { text });
        return response;
    },
    deleteMessage: async (chatId, messageId) => {
        const response = await api.delete(`/chat/${chatId}/message/${messageId}`);
        return response;
    }
}