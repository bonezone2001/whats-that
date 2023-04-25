import { useNavigation } from "@react-navigation/native";
import Button from "@components/shared/button";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { contactStyle, globalStyle } from "@styles";
import { useEffect, useState } from "react";

import noResultsImage from '@assets/images/no_results.png';
import { useStore } from "@store";

export default () => {
    const navigation = useNavigation();
    const store = useStore();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => navigation.navigate("Create")}
                    style={globalStyle.transparent}
                    size="small"
                    icon="plus"
                    iconLibrary="Feather"
                    iconSize={30}
                    textColor="#fff"
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
            const creator = item.creator;
            const placeholder = `created chat "${item.name}"`;
            if (creator.user_id === store.user.user_id)
                return `You ${placeholder}`;
            return `${creator.first_name} ${creator.last_name} ${placeholder}`;
        }
        return "WIP";
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
                            onPress={() => navigation.navigate("ViewChat", { chat: item })}
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