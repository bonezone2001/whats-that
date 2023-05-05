import Toast from 'react-native-toast-message';
import { appUtils } from '@utils';
import { useState } from 'react';
import api from '@api';

export const useChat = ({
    chat,
    ...props
}) => {
    const [editMessageContent, setEditMessageContent] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [editMessage, setEditMessage] = useState(null);
    const [message, setMessage] = useState('');

    // Deconstructed here so they can be reasigned
    let {
        onNewMessages = () => {},
        onMessageEdit = () => {},
        onMessageDelete = () => {},
    } = props;

    const beginChatRefresher = (ms) => {
        const interval = setInterval(() => fetchMessages(true), ms);
        return () => clearInterval(interval);
    };

    const fetchMessages = async (silent = false) => {
        try {
            if (!silent) setChatLoading(true);
            const { messages } = (await api.getChatDetails(chat.chat_id)).data;
            if (JSON.stringify(messages) !== JSON.stringify(chatMessages)) {
                const wasDelete = chatMessages.length > messages.length;
                setChatMessages(messages);
                if (!wasDelete) onNewMessages();
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not fetch messages',
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
                text1: 'Error',
                text2: 'Could not send message',
            });
        }
    };

    const handleSendOrEditMessage = async () => {
        try {
            const trimmedMsg = appUtils.multilineTrim(editMessageContent || message);
            if (trimmedMsg === '') return;
            if (editMessage) {
                await api.editMessage(chat.chat_id, editMessage.message_id, trimmedMsg);
                onMessageEdit(editMessage.message_id);
            } else {
                await api.sendMessage(chat.chat_id, trimmedMsg);
            }
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not send message',
            });
        } finally {
            clearMessageFields();
        }
    };

    const handleEditMessage = async (messageId) => {
        try {
            const trimmedMsg = appUtils.multilineTrim(message);
            if (trimmedMsg === '') return;
            await api.editMessage(chat.chat_id, messageId, trimmedMsg);
            onMessageEdit(messageId);
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not edit message',
            });
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await api.deleteMessage(chat.chat_id, messageId);
            onMessageDelete(messageId);
            await fetchMessages();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not delete message',
            });
        }
    };

    const clearMessageFields = () => {
        setEditMessage(null);
        setEditMessageContent('');
        setMessage('');
    };

    const setOnNewMessages = (callback) => {
        onNewMessages = callback;
    };

    const setOnMessageEdit = (callback) => {
        onMessageEdit = callback;
    };

    const setOnMessageDelete = (callback) => {
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
    };
};
