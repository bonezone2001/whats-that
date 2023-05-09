// Hook for controlling chat messages
// Primarily used to neaten and extend upon the chat view

import Toast from 'react-native-toast-message';
import { appUtils, chatUtils } from '@utils';
import { useEffect, useState } from 'react';
import { useStore } from '@store';
import { t } from '@locales';
import api from '@api';

export const useChat = ({
    chat,
    onNewMessages = () => {},
    onMessageEdit = () => {},
    onMessageDelete = () => {},
}) => {
    const [editMessageContent, setEditMessageContent] = useState('');
    const [postDateTime, setPostDateTime] = useState(new Date());
    const [draftToSchedule, setDraftToSchedule] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [editMessage, setEditMessage] = useState(null);
    const [message, setMessage] = useState('');
    const store = useStore();

    // Initialize chat messages
    useEffect(() => {
        fetchMessages();
    }, []);

    const beginChatRefresher = (ms) => {
        const interval = setInterval(() => fetchMessages(true), ms);
        return () => clearInterval(interval);
    };

    const fetchMessages = async (silent = false) => {
        try {
            if (!silent) setChatLoading(true);

            // Clone drafts so they can be reversed without affecting store
            // Add isDraft property to distinguish drafts from actual messages
            const drafts = appUtils.clone(store.drafts[chat.chat_id])
                ?.reverse()
                ?.map((draft) => ({ ...draft, isDraft: true }))
                || [];

            // Merge drafts and actual messages
            const { messages } = (await api.getChatDetails(chat.chat_id)).data;
            const allMessages = [...drafts, ...messages];

            // Only update when there is a difference
            if (JSON.stringify(allMessages) !== JSON.stringify(chatMessages)) {
                const wasDelete = chatMessages.length > allMessages.length;
                setChatMessages(allMessages);
                if (!wasDelete) onNewMessages();
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('hooks.useChat.fetchMessages_error'),
            });
        } finally {
            if (!silent) setChatLoading(false);
        }
    };

    const handleSendMessage = async () => {
        try {
            const trimmedMsg = appUtils.multilineTrim(message);
            if (trimmedMsg === '') return;
            await api.sendMessage(chat.chat_id, trimmedMsg);
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('hooks.useChat.handleSendMessage_error'),
            });
        }
    };

    const handleSendOrEditMessage = async (draft) => {
        try {
            const isDraft = draft || editMessage?.isDraft;
            const trimmedMsg = appUtils.multilineTrim(
                editMessageContent
                || message
                || draft?.message,
            );
            if (trimmedMsg === '') return;

            if (editMessage && !isDraft) {
                await api.editMessage(chat.chat_id, editMessage.message_id, trimmedMsg);
                onMessageEdit(editMessage);
            } else {
                await api.sendMessage(chat.chat_id, trimmedMsg);
                if (isDraft) {
                    await chatUtils.removeDraftFromStorage(
                        chat.chat_id,
                        editMessage?.created || draft?.created,
                    );
                }
            }

            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('hooks.useChat.handleSendOrEditMessage_error'),
            });
        } finally {
            clearMessageFields();
        }
    };

    const handleEditMessage = async (msg) => {
        try {
            const trimmedMsg = appUtils.multilineTrim(message);
            if (trimmedMsg === '') return;
            await api.editMessage(chat.chat_id, msg.message_id, trimmedMsg);
            onMessageEdit(msg);
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('hooks.useChat.handleEditMessage_error'),
            });
        }
    };

    const handleDeleteMessage = async (msg) => {
        try {
            if (msg.isDraft) {
                await chatUtils.removeDraftFromStorage(chat.chat_id, msg.created);
                await fetchMessages();
                return;
            }
            await api.deleteMessage(chat.chat_id, msg.message_id);
            onMessageDelete(msg);
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('hooks.useChat.handleDeleteMessage_error'),
            });
        }
    };

    const handleSaveDraft = async () => {
        try {
            const trimmedMsg = appUtils.multilineTrim(editMessageContent || message);
            if (trimmedMsg === '') return;
            if (editMessage) {
                await chatUtils.updateDraftInStorage(chat.chat_id, editMessage.created, {
                    ...editMessage, // will add isDraft property but it's ok
                    message: trimmedMsg,
                });
            } else {
                // -1 timestamp means it's not scheduled
                await chatUtils.saveDraftToStorage(chat.chat_id, {
                    message: trimmedMsg,
                    timestamp: -1,
                    created: Date.now(),
                });
            }
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('hooks.useChat.handleSaveDraft_error'),
            });
        } finally {
            clearMessageFields();
        }
    };

    const handleScheduleDraft = async () => {
        try {
            // Update draft in storage with new timestamp
            if (!draftToSchedule) return;
            await chatUtils.updateDraftInStorage(chat.chat_id, draftToSchedule?.created, {
                ...draftToSchedule,
                timestamp: postDateTime.valueOf(),
            });
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('hooks.useChat.handleScheduleDraft_error'),
            });
        }
    };

    const clearMessageFields = () => {
        setEditMessage(null);
        setEditMessageContent('');
        setMessage('');
    };

    const setOnNewMessages = (callback) => {
        // eslint-disable-next-line no-param-reassign
        onNewMessages = callback;
    };

    const setOnMessageEdit = (callback) => {
        // eslint-disable-next-line no-param-reassign
        onMessageEdit = callback;
    };

    const setOnMessageDelete = (callback) => {
        // eslint-disable-next-line no-param-reassign
        onMessageDelete = callback;
    };

    return {
        chatMessages,
        chatLoading,
        beginChatRefresher,
        handleSendMessage,
        handleSendOrEditMessage,
        handleEditMessage,
        handleDeleteMessage,
        handleSaveDraft,
        handleScheduleDraft,
        fetchMessages,
        setOnNewMessages,
        setOnMessageEdit,
        setOnMessageDelete,
        clearMessageFields,
        editMessage,
        setEditMessage,
        editMessageContent,
        setEditMessageContent,
        message,
        setMessage,
        showDatePicker,
        setShowDatePicker,
        postDateTime,
        setPostDateTime,
        draftToSchedule,
        setDraftToSchedule,
    };
};
