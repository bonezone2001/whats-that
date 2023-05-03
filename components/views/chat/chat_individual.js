import {
    View, Text, StyleSheet, FlatList, ActivityIndicator, Platform,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import ChatBubble from '@components/shared/chat_bubble';
import TextInput from '@components/shared/text_input';
import Button from '@components/shared/button';
import { globalStyle } from '@styles';
import { apiUtils, appUtils } from '@utils';
import { useStore } from '@store';
import PropTypes from 'prop-types';
import api from '@api';

export default function ChatIndividual({ route }) {
    const { chat } = route.params;

    const [editMessageContent, setEditMessageContent] = useState('');
    const [editMessage, setEditMessage] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const flatListRef = useRef(null);

    const navigation = useNavigation();
    const store = useStore();

    const fetchMessages = async (silent = false) => {
        if (!silent) setLoading(true);
        const { messages } = (await api.getChatDetails(chat.chat_id)).data;
        if (JSON.stringify(messages) !== JSON.stringify(chatMessages)) { setChatMessages(messages); }
        if (!silent) setLoading(false);
    };

    const handleSend = async () => {
        try {
            const trimmedMessage = appUtils.multilineTrim(message);
            if (trimmedMessage === '') return;
            await api.sendMessage(chat.chat_id, trimmedMessage);
            await fetchMessages();
            setMessage('');
            setTimeout(() => flatListRef.current.scrollToOffset({ animated: true, offset: 0 }), 250);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async () => {
        try {
            const trimmedMessage = appUtils.multilineTrim(editMessageContent);
            if (trimmedMessage === '') return;
            await api.editMessage(chat.chat_id, editMessage.message_id, trimmedMessage);
            await fetchMessages();
        } catch (error) {
            console.log(error);
        } finally {
            setEditMessage(null);
            setEditMessageContent('');
        }
    };

    const onDeletePress = async (item) => {
        if (editMessage?.message_id === item.message_id) setEditMessage(null);
        try {
            await api.deleteMessage(chat.chat_id, item.message_id);
            fetchMessages();
        } catch (error) {
            console.log(error);
        }
    };

    const onEditPress = async (item) => {
        setEditMessage(item);
        setEditMessageContent(item.message);
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => {
                        // Move this from here since the back button is not always what is used to go back
                        apiUtils.updateChats();
                        navigation.navigate('View');
                    }}
                    mode="text"
                    icon="chevron-left"
                    prefixSize={38}
                />
            ),
            headerRight: () => (
                <Button
                    mode="text"
                    onPress={() => store.bottomSheet.current?.expand()}
                    icon="more-vertical"
                    prefixSize={28}
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>{chat.name}</Text>
            ),
        });
        fetchMessages();

        // Update messages every 2.5 seconds, since to my knowledge, there is no way to know new messages exist
        // There is no polling or websocket systems in place.
        const interval = setInterval(() => fetchMessages(true), 4000);
        return () => clearInterval(interval);
    }, []);

    const rendermessageBox = ({ item, index }) => {
        const isMe = item.author.user_id === store.user.user_id;
        const isSameAuthorAsNext = index < chatMessages.length - 1
            && item.author.user_id === chatMessages[index + 1].author.user_id;
        return (
            <ChatBubble
                key={item.message_id}
                item={item}
                isMe={isMe}
                isSameAuthorAsNext={isSameAuthorAsNext}
                onDeletePress={onDeletePress}
                onEditPress={onEditPress}
            />
        );
    };

    return (
        <View style={globalStyle.container}>
            <FlatList
                ref={flatListRef}
                style={styles.chatList}
                data={chatMessages}
                renderItem={rendermessageBox}
                contentContainerStyle={styles.chatContainer}
                ListFooterComponent={loading && <ActivityIndicator />}
                initialNumToRender={20}
                inverted
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={editMessage ? editMessageContent : message}
                    multiline
                    onChangeText={editMessage ? setEditMessageContent : setMessage}
                    placeholder="Type a message..."
                    label={editMessage ? 'Editting message' : ''}
                    block={80}
                    onSubmitEditing={editMessage ? handleEdit : handleSend}
                    blurOnSubmit={Platform.OS === 'web'}
                />
                <Button
                    mode="text"
                    onPress={editMessage ? handleEdit : handleSend}
                    icon="send"
                    prefixSize={25}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chatList: {
        flex: 1,
        width: '100%',
    },
    chatContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    messageBox: {
        maxWidth: '80%',
        marginBottom: 8,
    },
    bubble: {
        borderRadius: 20,
        padding: 15,
    },
    meBubble: {
        backgroundColor: '#c8a48c',
        borderBottomRightRadius: 0,
    },
    otherBubble: {
        backgroundColor: '#372d2b',
        borderBottomLeftRadius: 0,
    },
    chatText: {
        fontSize: 16,
        lineHeight: 20,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#d8d8d822',
    },
    input: {
        paddingHorizontal: 12,
        marginRight: 8,
    },
    sendButton: {
        marginLeft: 8,
        height: 45,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    authorName: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

ChatIndividual.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            chat: PropTypes.shape({
                chat_id: PropTypes.number,
                name: PropTypes.string,
            }),
        }),
    }).isRequired,
};