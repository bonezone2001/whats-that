// Chat conversation screen.
// Allows users to seen and send/edit/delete messages to the group chat.
// Also allow for drafting and scheduling messages. TODO: Add localization of date/time

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
import GlobalDateTimePicker, {
    DateTimePickerMode,
} from 'react-native-global-datetimepicker';
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
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
import { t } from '@locales';

export default function ChatIndividual({ route }) {
    const chatDetails = route.params.chat;
    const chat = useChat({ chat: chatDetails });
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const store = useStore();

    const [dateTimeMode, setDateTimeMode] = useState(DateTimePickerMode.Day);

    useEffect(
        // Save draft when leaving chat - Potential race condition here? Not sure.
        () => navigation.addListener('beforeRemove', () => {
            chat.handleSaveDraft();
        }),
        [navigation, chat.message],
    );

    // Refresh chat every 4 seconds
    useEffect(() => chat.beginChatRefresher(4000), [chat.chatMessages]);

    // Scroll to bottom when new messages are received
    chat.setOnNewMessages(() => {
        setTimeout(() => flatListRef.current.scrollToOffset({
            animated: true,
            offset: 0,
        }), 250);
    });

    // Clear message inputs when message being edited is deleted
    chat.setOnMessageDelete((message) => {
        if (
            chat.editMessage?.message_id === message.message_id
            || chat.replyMessage?.created === message.created
        ) {
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
                accessibilityLabel={t('screens.chat.individual.chat_options')}
            />
        ),
        args: [chatDetails.name],
    });

    const rendermessageBox = useCallback(({ item, index }) => {
        // Determines if message will be rendered on the left or right
        const isMe = item.author?.user_id === store.user.user_id || item.isDraft;

        // Extra renderables (name and timestamp)
        let isSameAuthorAsNext = false;
        let shouldShowTimestamp = false;
        if (!item.isDraft) {
            isSameAuthorAsNext = chatUtils.isSameAuthorAsNext(item, index, chat.chatMessages);
            shouldShowTimestamp = chatUtils.shouldShowTimestamp(index, chat.chatMessages);
        }

        return (
            <ChatBubble
                key={item.message_id}
                item={item}
                isMe={isMe}
                isSameAuthorAsNext={isSameAuthorAsNext}
                shouldShowTimestamp={shouldShowTimestamp}
                onDeletePress={() => chat.handleDeleteMessage(item)}
                onSendPress={() => chat.handleSendOrEditMessage(item)}
                onSchedulePress={() => {
                    chat.setPostDateTime(new Date(item.created));
                    chat.setDraftToSchedule(item);
                    chat.setShowDatePicker(true);
                }}
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
                    placeholder={t('screens.chat.individual.message_placeholder')}
                    label={chat.editMessage ? t('screens.chat.individual.editing_message') : ''}
                    block={68}
                    onSubmitEditing={chat.handleSendOrEditMessage}
                    blurOnSubmit={Platform.OS === 'web'}
                    accessibleLabel={t('screens.chat.individual.message_placeholder')}
                />
                <Button
                    mode="text"
                    onPress={chat.handleSaveDraft}
                    icon="save"
                    prefixSize={25}
                    accessibilityLabel={t('screens.chat.individual.draft_message')}
                />
                <Button
                    mode="text"
                    onPress={chat.handleSendOrEditMessage}
                    icon="send"
                    prefixSize={25}
                    accessibilityLabel={t('screens.chat.individual.send_message')}
                />
            </View>

            <GlobalDateTimePicker
                visible={chat.showDatePicker}
                initialDate={chat.postDateTime}
                mode={dateTimeMode}
                onSelect={(date) => {
                    if (dateTimeMode === DateTimePickerMode.Day) {
                        chat.setPostDateTime(date);
                        setDateTimeMode(DateTimePickerMode.Hour);
                    } else {
                        setDateTimeMode(DateTimePickerMode.Day);
                        chat.postDateTime.setTime(date.getTime());
                        chat.setShowDatePicker(false);
                        chat.handleScheduleDraft()
                    }
                }}
                onCancel={() => {
                    chat.setShowDatePicker(false);
                    setDateTimeMode(DateTimePickerMode.Day);
                }}
            />
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
