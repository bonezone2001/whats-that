// Utility functions for the api wrapper.
// Mainly used to automatically update the store after an api call.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '@store';

export const chatUtils = {
    isSameAuthorAsNext: (index, chatMessages) => {
        if (index >= chatMessages.length - 1) return false;
        return chatMessages[index]?.author?.user_id === chatMessages[index + 1]?.author?.user_id;
    },

    areSameDay(date1, date2) {
        return date1.getDate() === date2.getDate()
            && date1.getMonth() === date2.getMonth()
            && date1.getFullYear() === date2.getFullYear();
    },

    // Format timestamp as Today, Yesterday, or date along with time
    formatTimestamp(timestamp, showToday = true, onlyTime = false) {
        if (!timestamp) return '';
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const date = new Date(timestamp);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (onlyTime) return time;
        if (chatUtils.areSameDay(date, today)) return showToday ? `Today at ${time}` : time;
        if (chatUtils.areSameDay(date, yesterday)) return `Yesterday at ${time}`;
        return date.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
    },

    // This is not necessarily correct, but it's good enough for now
    // If timestamp difference is more than 5 minutes or is new day, show timestamp
    shouldShowTimestamp(index, chatMessages) {
        if (index === chatMessages.length - 1) return true;
        const currentMessage = chatMessages[index];
        const previousMessage = chatMessages[index + 1];
        if (!chatUtils.areSameDay(
            new Date(currentMessage.timestamp),
            new Date(previousMessage.timestamp),
        )) return true;
        const timeDifference = currentMessage.timestamp - previousMessage.timestamp;
        return timeDifference > 5 * 60 * 1000;
    },

    strToColor(str) {
        const hash = str.split('').reduce((acc, char) => {
            const newHash = (acc << 5) - acc + char.charCodeAt(0);
            return newHash & newHash;
        }, 0);

        let r = (hash & 0xFF0000) >> 16;
        let g = (hash & 0x00FF00) >> 8;
        let b = hash & 0x0000FF;

        const isGreyish = Math.abs(r - g) <= 32 && Math.abs(g - b) <= 32 && Math.abs(r - b) <= 32;
        const isBlack = r <= 32 && g <= 32 && b <= 32;

        if (isGreyish || isBlack) {
            r = Math.min(r + 64, 255);
            g = Math.min(g + 64, 255);
            b = Math.min(b + 64, 255);
        }

        const hexColor = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        return hexColor;
    },

    saveDraftToStorage: async (chatId, draft) => {
        const store = useStore.getState();
        const draftDict = store.drafts;

        if (!draftDict[chatId]) draftDict[chatId] = [];
        draftDict[chatId].push(draft);

        store.setDrafts(draftDict);
        await AsyncStorage.setItem('drafts', JSON.stringify(draftDict));
    },

    updateDraftInStorage: async (chatId, created, draft) => {
        const store = useStore.getState();
        const draftDict = store.drafts;

        if (!draftDict[chatId]) return;
        draftDict[chatId] = draftDict[chatId].map((d) => {
            if (d.created === created) return draft;
            return d;
        });

        store.setDrafts(draftDict);
        await AsyncStorage.setItem('drafts', JSON.stringify(draftDict));
    },

    removeDraftFromStorage: async (chatId, created) => {
        const store = useStore.getState();
        const draftDict = store.drafts;

        if (!draftDict[chatId]) return;
        draftDict[chatId] = draftDict[chatId].filter((draft) => draft.created !== created);
        if (draftDict[chatId].length === 0) delete draftDict[chatId];

        store.setDrafts(draftDict);
        await AsyncStorage.setItem('drafts', JSON.stringify(draftDict));
    },

    clearDraftStorage: async () => {
        const store = useStore.getState();
        store.setDrafts({});
        await AsyncStorage.removeItem('drafts');
    },
};
