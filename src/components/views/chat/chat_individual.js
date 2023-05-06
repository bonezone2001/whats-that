// Chat conversation screen.
// Allows users to seen and send/edit/delete messages to the group chat.

// Note on android performance:
// There is currently a bug in react native that causes the flatlist to lag when inverted
// There used to be a workaround using scaleY: -1, but it no longer works, for me at least
// https://github.com/facebook/react-native/issues/30034

import {
    View,
    FlatList,
    ActivityIndicator,
    Platform,
} from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '@components/shared/headers';
import ChatBubble from '@components/shared/chat_bubble';
import TextInput from '@components/shared/text_input';
import { useChat, useScreenHeader } from '@hooks';
import { chatStyle, globalStyle } from '@styles';
import Button from '@components/shared/button';
import { apiUtils, chatUtils } from '@utils';
import PropTypes from 'prop-types';
import { useStore } from '@store';

export default function ChatIndividual({ route }) {
    const chatDetails = route.params.chat;
    const chat = useChat({ chat: chatDetails });
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const store = useStore();

    // Refresh chat every 4 seconds
    useEffect(() => { chat.fetchMessages(); }, []);
    useEffect(() => chat.beginChatRefresher(4000), [chat.chatMessages]);

    // Scroll to bottom when new messages are received
    chat.setOnNewMessages(() => {
        setTimeout(() => flatListRef.current.scrollToOffset({
            animated: true,
            offset: 0,
        }), 250);
    });

    // Clear message inputs when message being edited is deleted
    chat.setOnMessageDelete((messageId) => {
        if (chat.editMessage?.message_id === messageId) {
            chat.clearMessageFields();
        }
    });

    useScreenHeader({
        left: (
            <BackButton
                onPress={() => {
                    apiUtils.updateChats();
                    navigation.navigate('View');
                }}
            />
        ),
        title: chatDetails.name,
        right: (
            <Button
                mode="text"
                onPress={() => store.bottomSheet.current?.expand()}
                icon="more-vertical"
                prefixSize={28}
            />
        ),
        args: [chatDetails.name],
    });

    const rendermessageBox = useCallback(({ item, index }) => {
        // Author and message content info
        const isMe = item.author.user_id === store.user.user_id;
        const isSameAuthorAsNext = chatUtils.isSameAuthorAsNext(index, chat.chatMessages);

        // Timestamp info
        const shouldShowTimestamp = chatUtils.shouldShowTimestamp(index, chat.chatMessages);

        return (
            <ChatBubble
                key={item.message_id}
                item={item}
                isMe={isMe}
                isSameAuthorAsNext={isSameAuthorAsNext}
                shouldShowTimestamp={shouldShowTimestamp}
                onDeletePress={() => chat.handleDeleteMessage(item.message_id)}
                onEditPress={() => {
                    chat.setEditMessage(item);
                    chat.setEditMessageContent(item.message);
                }}
            />
        );
    });

    return (
        <View style={globalStyle.container}>
            <FlatList
                ref={flatListRef}
                style={chatStyle.chatList}
                data={chat.chatMessages}
                renderItem={rendermessageBox}
                contentContainerStyle={chatStyle.chatContainer}
                ListFooterComponent={chat.chatLoading && <ActivityIndicator />}
                initialNumToRender={20}
                inverted
            />

            <View style={chatStyle.inputContainer}>
                <TextInput
                    value={chat.editMessage ? chat.editMessageContent : chat.message}
                    multiline
                    onChangeText={chat.editMessage ? chat.setEditMessageContent : chat.setMessage}
                    placeholder="Type a message..."
                    label={chat.editMessage ? 'Editting message' : ''}
                    block={80}
                    onSubmitEditing={chat.handleSendOrEditMessage}
                    blurOnSubmit={Platform.OS === 'web'}
                />
                <Button
                    mode="text"
                    onPress={chat.handleSendOrEditMessage}
                    icon="send"
                    prefixSize={25}
                />
            </View>
        </View>
    );
}

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
