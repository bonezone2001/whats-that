import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import Button from '@components/shared/button';
import { colors, globalStyle } from '@styles';
import { useStore } from '@store';
import api from '@api';

export default ({ route }) => {
    const { chat } = route.params;
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef(null);
    const store = useStore();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate("View")}
                    style={globalStyle.transparent}
                    size="small"
                    icon="chevron-left"
                    iconLibrary="Feather"
                    iconSize={40}
                    textColor="#fff"
                />
            ),
            headerRight: () => (
                <Button
                    onPress={() => navigation.navigate("ViewChatSettings", { chat })}
                    style={globalStyle.transparent}
                    size="small"
                    icon="more-vertical"
                    iconLibrary="Feather"
                    iconSize={28}
                    textColor="#fff"
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>{chat.name}</Text>
            ),
        });
        fetchMessages();

        // Update messages every 2.5 seconds, since to my knowledge, there is no way to know new messages exist
        // There is no polling or websocket systems in place.
        const interval = setInterval(() => fetchMessages(true), 2500);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async (silent = false) => {
        if (!silent) setLoading(true);
        const { messages } = (await api.getChatDetails(chat.chat_id)).data;
        setChatMessages(messages);
        if (!silent) setLoading(false);
    };

    const handleSend = async () => {
        try {
            if (message.trim() === '') return;
            await api.sendMessage(chat.chat_id, message.trim());
            await fetchMessages();
            setMessage('');
            setTimeout(() => flatListRef.current.scrollToOffset({ animated: true, offset: 0 }), 250);
        } catch (error) {
            console.log(error);
        }
    };

    const renderChatBubble = ({ item }) => {
        return (
        <View
            key={item.message_id}
            style={[
                styles.chatBubble,
                item.author.user_id === store.user.user_id ? styles.meBubble : styles.otherBubble,
            ]}
        >
            <Text style={styles.chatText}>{item.message}</Text>
        </View>
    )};

    return (
        <View style={globalStyle.container}>
            <FlatList
                ref={flatListRef}
                style={styles.chatList}
                data={chatMessages}
                renderItem={renderChatBubble}
                contentContainerStyle={styles.chatContainer}
                ListFooterComponent={loading && <ActivityIndicator />}
                inverted
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    multiline={true}
                    onChangeText={setMessage}
                    placeholder="Type your message here"
                    block={80}
                />
                <Button
                    style={globalStyle.transparent}
                    shape="circle"
                    onPress={handleSend}
                    size="small"
                    icon="send"
                    textColor="#fff"
                    iconLibrary="Feather"
                    iconSize={25}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chatList: {
        flex: 1,
        width: '100%',
    },
    chatContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    chatBubble: {
        maxWidth: '80%',
        borderRadius: 20,
        padding: 15,
        marginBottom: 8,
    },
    meBubble: {
        alignSelf: 'flex-end',
        backgroundColor: colors.secondary,
    },
    otherBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
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
        backgroundColor: 'transparent',
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
});