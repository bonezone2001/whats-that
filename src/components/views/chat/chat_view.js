// View chat list screen.
// Show the list of chats the user is in, navigation to create chat + individual chat.

import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { chatStyle, contactStyle, globalStyle } from '@styles';
import { useNavigation } from '@react-navigation/native';
import Button from '@components/shared/button';
import { useScreenHeader } from '@hooks';
import { chatUtils } from '@utils';
import { useStore } from '@store';
import React from 'react';

import noResultsImage from '@assets/images/no_results.png';

export default function ChatView() {
    const navigation = useNavigation();
    const store = useStore();

    useScreenHeader({
        left: null,
        title: 'Chats',
        right: (
            <Button
                mode="text"
                icon="plus"
                prefixSize={30}
                href="Create"
            />
        ),
    });

    const renderLastMessage = (item) => {
        if (!Object.keys(item.last_message).length) {
            const { creator } = item;
            const placeholder = `created chat "${item.name}"`;
            if (creator.user_id === store.user.user_id) return `You ${placeholder}`;
            return `${creator.first_name} ${creator.last_name} ${placeholder}`;
        }
        return `${item.last_message.author.first_name}: ${item.last_message.message}`;
    };

    const getSortedChats = () => store.chats.sort((a, b) => {
        const aHasMessage = Object.keys(a.last_message).length;
        const bHasMessage = Object.keys(b.last_message).length;

        if (!aHasMessage || !bHasMessage) {
            if (!aHasMessage && !bHasMessage) return a.name.localeCompare(b.name);
            return aHasMessage ? -1 : 1;
        }
        return b.last_message.timestamp - a.last_message.timestamp;
    });

    return (
        <View style={globalStyle.container}>
            {store?.chats?.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={getSortedChats()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={chatStyle.chat}
                            onPress={() => navigation.navigate('ViewChat', { chat: item })}
                        >
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={chatStyle.name}>
                                    {item.name}
                                </Text>
                                <View style={chatStyle.lastMessageContainer}>
                                    <Text numberOfLines={1} style={chatStyle.lastMessage}>
                                        {renderLastMessage(item)}
                                    </Text>
                                    <Text style={chatStyle.timestamp}>
                                        {chatUtils.formatTimestamp(item.last_message.timestamp)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    )}
                    keyExtractor={(item) => item.chat_id.toString()}
                />
            ) : (
                <View style={[contactStyle.placeholderContainer, { alignItems: 'center' }]}>
                    <Image source={noResultsImage} style={contactStyle.placeholderImage} />
                    <Text style={contactStyle.placeholderText}>No conversations</Text>
                </View>
            )}
        </View>
    );
}
