import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import Button from '@components/shared/button';
import { colors, globalStyle } from '@styles';
import { useStore } from '@store';
import api from '@api';
import { apiUtils } from '@utils';

export default ({ route }) => {
    const { chat } = route.params;

    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const flatListRef = useRef(null);

    const navigation = useNavigation();
    const store = useStore();

    const colours = [
        '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
    ];

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => {
                        // Move this from here since the back button is not always what is used to go back
                        apiUtils.updateChats();
                        navigation.navigate("View")
                    }}
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
                    onPress={() => store.bottomSheet.current?.expand()}
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
        const interval = setInterval(() => fetchMessages(true), 4000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async (silent = false) => {
        if (!silent) setLoading(true);
        const { messages } = (await api.getChatDetails(chat.chat_id)).data;
        if (JSON.stringify(messages) !== JSON.stringify(chatMessages)) 
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

    const rendermessageBox = ({ item, index }) => {
        const isMe = item.author.user_id === store.user.user_id;
        const isSameAuthorAsNext =
            index < chatMessages.length - 1 &&
            item.author.user_id === chatMessages[index + 1].author.user_id;

        return (
            <View
                key={item.message_id}
                style={[
                    styles.messageBox,
                    isMe
                        ? { alignSelf: 'flex-end'}
                        : { alignSelf: 'flex-start' },
                ]}
            >
                {!isSameAuthorAsNext && !isMe && (
                    <Text style={[styles.authorName, { color: colours[item.author.user_id % colours.length] }, { alignSelf: isMe ? 'flex-end' : 'flex-start'}]}>{item.author.first_name} </Text>
                )}
                <View style={[styles.bubble,
                isMe
                    ? styles.meBubble
                    : styles.otherBubble,
                ]}>
                    <Text style={[styles.chatText, { color: isMe ? '#000' : '#fff' }]}>{item.message}</Text>
                </View>
            </View>
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
    authorName: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});