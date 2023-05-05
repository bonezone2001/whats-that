// View chat list screen.
// Show the list of chats the user is in, navigation to create chat + individual chat.

import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderTitle } from '@components/shared/headers';
import { contactStyle, globalStyle } from '@styles';
import Button from '@components/shared/button';
import React, { useEffect } from 'react';
import { useStore } from '@store';

import noResultsImage from '@assets/images/no_results.png';
import { appUtils } from '@utils';

export default function ChatView() {
    const navigation = useNavigation();
    const store = useStore();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <HeaderTitle title="Chats" />,
            headerRight: () => (
                <Button
                    mode="text"
                    icon="plus"
                    prefixSize={30}
                    href="Create"
                />
            ),
        });
    }, []);

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
                            style={styles.chat}
                            onPress={() => navigation.navigate('ViewChat', { chat: item })}
                        >
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={styles.name}>
                                    {item.name}
                                </Text>
                                <View style={styles.lastMessageContainer}>
                                    <Text numberOfLines={1} style={styles.lastMessage}>
                                        {renderLastMessage(item)}
                                    </Text>
                                    <Text style={styles.timestamp}>
                                        {appUtils.formatTimestamp(item.last_message.timestamp)}
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

const styles = StyleSheet.create({
    chat: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: '#aaa',
        marginRight: 5,
    },
    timestamp: {
        fontSize: 12,
        color: '#aaa',
    },
});
