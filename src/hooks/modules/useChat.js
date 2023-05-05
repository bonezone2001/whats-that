import {
    useState,
} from 'react';
import api from '@api';
import { appUtils } from '@utils';

export const useChat = ({
    chat,
    ...props
}) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    // Deconstructed here so they can be reasigned
    let {
        onNewMessages = () => {},
        onMessageEdit = () => {},
        onMessageDelete = () => {},
    } = props;

    const beginChatRefresher = (ms) => {
        fetchMessages();
        const interval = setInterval(() => fetchMessages(true), ms);
        return () => clearInterval(interval);
    };

    const fetchMessages = async (silent = false) => {
        try {
            if (!silent) setChatLoading(true);
            const { messages } = (await api.getChatDetails(chat.chat_id)).data;
            if (JSON.stringify(messages) !== JSON.stringify(chatMessages)) {
                setChatMessages(messages);
                onNewMessages();
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (!silent) setChatLoading(false);
        }
    };

    const handleSendMessage = async (message) => {
        try {
            const trimmedMsg = appUtils.multilineTrim(message);
            if (trimmedMsg === '') return;
            await api.sendMessage(chat.chat_id, trimmedMsg);
            await fetchMessages();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditMessage = async (messageId, message) => {
        try {
            const trimmedMsg = appUtils.multilineTrim(message);
            if (trimmedMsg === '') return;
            await api.editMessage(chat.chat_id, messageId, trimmedMsg);
            onMessageEdit();
            await fetchMessages();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await api.deleteMessage(chat.chat_id, messageId);
            onMessageDelete();
            await fetchMessages();
        } catch (error) {
            console.log(error);
        }
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
        handleEditMessage,
        handleDeleteMessage,
        fetchMessages,
        setOnNewMessages,
        setOnMessageEdit,
        setOnMessageDelete,
    };
};
