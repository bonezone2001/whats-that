// Hook to send off draft messages that have been scheduled

import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useEffect, useState } from 'react';
import { chatUtils } from '@utils';
import { useStore } from '@store';
import { t } from '@locales';
import api from '@api';

export const useDraftScheduler = () => {
    const [isStarted, setIsStarted] = useState(false);
    const store = useStore();

    const startScheduler = () => setIsStarted(true);
    const stopScheduler = () => setIsStarted(false);

    useEffect(() => {
        if (!isStarted) return () => {};
        const interval = setInterval(async () => {
            const drafts = store?.drafts || {};
            // Find drafts that are ready
            const draftsToSend = Object.entries(drafts)
                .map(([chatId, chatDrafts]) => chatDrafts
                    .filter((draft) => (draft.timestamp > 0 && draft.timestamp <= Date.now()))
                    .map((draft) => ({ chatId: parseInt(chatId, 10), draft })))
                .flat();

            // Send scheduled drafts
            draftsToSend.forEach((entry) => {
                api.sendMessage(entry.chatId, entry.draft.message);
                chatUtils.removeDraftFromStorage(entry.chatId, entry.draft.created);
                Toast.show({
                    type: 'success',
                    text1: t('draft_sent'),
                    text2: entry.draft.message,
                });
            });
        }, 1_000);
        return () => clearInterval(interval);
    }, [isStarted, store.drafts]);

    return {
        startScheduler,
        stopScheduler,
        isStarted,
    };
};
