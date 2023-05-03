/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { appUtils } from '@utils/utils_app';
import Constants from 'expo-constants';
import { useStore } from '@store';
import axios from 'axios';

// Since most of the api is stateless (we don't store any data in the api itself)
// we don't need react hooks, just use an object and import the store for the single state (token)

const { API_BASE_URL } = Constants.manifest.extra;

// Create api client
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add the authorization header to all requests (if the user is logged in)
api.interceptors.request.use(
    async (config) => {
        const store = useStore.getState();
        if (store.token) config.headers['X-Authorization'] = store.token;
        return config;
    },
);

export default {
    // Auth
    login: async (email, password) => {
        const response = await api.post('/login', { email, password });
        return response;
    },
    register: async (first_name, last_name, email, password) => {
        const response = await api.post('/user', {
            first_name, last_name, email, password,
        });
        return response;
    },
    logout: async () => {
        const response = await api.post('/logout');
        return response;
    },
    testAuth: async (token) => {
        const response = await api.get('/contacts', { headers: { 'X-Authorization': token }, timeout: 2500 });
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
        const response = await api.get(`/user/${userId}/photo`, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        return appUtils.blobToDataUrl(blob);
    },
    uploadUserPhoto: async (userId, photo) => {
        // Accept support for blob + base64 (base64 to a buffer)
        // Blob wouldn't work on android at all but buffer works on both
        if (typeof photo === 'string') photo = appUtils.dataUrlToBuffer(photo);
        else photo = { buffer: photo, type: photo.type };
        const response = await api.post(`/user/${userId}/photo`, photo.buffer, {
            headers: { 'Content-Type': photo.type },
        });
        return response;
    },
    searchUsers: async (query, search_in = 'all', limit = 20, offset = 0) => {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}&search_in=${search_in}&limit=${limit}&offset=${offset}`);
        return response;
    },

    // Contacts
    getContacts: async () => {
        const response = await api.get('/contacts');
        return response;
    },
    addContact: async (userId) => {
        const response = await api.post(`/user/${userId}/contact`);
        return response;
    },
    removeContact: async (userId) => {
        const response = await api.delete(`/user/${userId}/contact`);
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
    // limit and offset aren't implemented on the api. I ended up implementing scrolling to load but
    // it wasn't working, so I checked the api and it doesn't support it. sadness.
    getChatDetails: async (chatId) => {
        // const response = await api.get(`/chat/${chatId}?limit=${limit}&offset=${offset}`);
        const response = await api.get(`/chat/${chatId}`);
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
    addUserToChat: async (chatId, userId) => {
        const response = await api.post(`/chat/${chatId}/user/${userId}`);
        return response;
    },
    removeUserFromChat: async (chatId, userId) => {
        const response = await api.delete(`/chat/${chatId}/user/${userId}`);
        return response;
    },

    // Messages
    sendMessage: async (chatId, message) => {
        const response = await api.post(`/chat/${chatId}/message`, { message });
        return response;
    },
    editMessage: async (chatId, messageId, message) => {
        const response = await api.patch(`/chat/${chatId}/message/${messageId}`, { message });
        return response;
    },
    deleteMessage: async (chatId, messageId) => {
        const response = await api.delete(`/chat/${chatId}/message/${messageId}`);
        return response;
    },
};
