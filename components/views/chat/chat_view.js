import { useNavigation } from '@react-navigation/native';
import Button from '@components/shared/button';
import React, { useEffect } from 'react';
import {
    View, Text, Image, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { contactStyle, globalStyle } from '@styles';
import { useStore } from '@store';

import noResultsImage from '@assets/images/no_results.png';

export default function ChatView() {
    const navigation = useNavigation();
    const store = useStore();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    mode="text"
                    icon="plus"
                    prefixSize={30}
                    href="Create"
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>Chats</Text>
            ),
        });
    }, []);

    // useEffect(() => {
    //     console.log(store.chats);
    // }, [store.chats]);

    const renderLastMessage = (item) => {
        if (!Object.keys(item.last_message).length) {
            const { creator } = item;
            const placeholder = `created chat "${item.name}"`;
            if (creator.user_id === store.user.user_id) return `You ${placeholder}`;
            return `${creator.first_name} ${creator.last_name} ${placeholder}`;
        }
        return `${item.last_message.author.first_name}: ${item.last_message.message}`;
    };

    return (
        <View style={globalStyle.container}>
            {store?.chats?.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={store.chats}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.chat}
                            onPress={() => navigation.navigate('ViewChat', { chat: item })}
                        >
                            <View style={styles.infoContainer}>
                                <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                                <Text numberOfLines={1} style={styles.lastMessage}>{renderLastMessage(item)}</Text>
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
    // Prevent text from overflowing
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    lastMessage: {
        fontSize: 14,
        color: '#aaa',
    },
});
