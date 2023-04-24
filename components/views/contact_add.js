import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { View, Text, StyleSheet, Image } from "react-native";
import TextInput from "@components/shared/text_input";
import Avatar from "@components/shared/avatar";
import Button from "@components/shared/button";
import { colors, globalStyle } from "@styles";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { apiUtils, appUtils } from "@utils";
import { useStore } from "@store";
import api from "@api";

import noResultsImage from '@assets/images/no_results.png';

export default () => {
    const [searchResults, setSearchResults] = useState([]);
    const navigation = useNavigation();
    const store = useStore();

    const searchForContact = async (query) => {
        if (query.length === 0) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await api.searchUsers(query);
            const contacts = response.data.filter((user) => user.user_id !== store.userId);
            for (let i = 0; i < contacts.length; i++) {
                const user = contacts[i];
                const avatarData = await api.getUserPhoto(user.user_id);
                user.avatar = avatarData;

                // Search if array of objects includes users with matching user_id
                if (store.contacts) user.isContact = store.contacts.some((contact) => contact.user_id === user.user_id);
                if (store.blocked) user.isBlocked = store.blocked.some((blocked) => blocked.user_id === user.user_id);
            }
            setSearchResults(contacts);
        } catch (error) {
            console.log(error);
        }
    };

    // Delay calling searchForContact to prevent spamming the server with incomplete queries
    const debouncedSearch = appUtils.debounce(searchForContact, 250);

    const addContact = async (user) => {
        try {
            if (user.isContact)
                await api.removeContact(user.user_id);
            else
                await api.addContact(user.user_id);
            user.isContact = !user.isContact;
            await apiUtils.updateContacts(store);
            console.log("Added contact!");
        } catch (error) {
            console.log(error);
        }
    };

    const blockContact = async (user) => {
        try {
            if (user.isBlocked)
                await api.unblockUser(user.user_id);
            else
                await api.blockUser(user.user_id);
            user.isBlocked = !user.isBlocked;
            await apiUtils.updateBlocked(store);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate("View")}
                    style={globalStyle.transparent}
                    size="small"
                >
                    <Feather name="x" size={40} color="#fff" />
                </Button>
            ),
            headerTitle: () => (
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchBarText}
                        placeholder="Search"
                        placeholderTextColor="#fff"
                        icon="search"
                        onChangeText={debouncedSearch}
                    />
                </View>
            ),
        });
    }, [setSearchResults, store]);
    
    return (
        <View style={[globalStyle.container, styles.container]}>
            {searchResults.length > 0 ? (
                <FlatList
                    style={[globalStyle.contactList, { width: "100%" }]}
                    data={searchResults}
                    renderItem={({ item }) => (
                        <View style={styles.contact}>
                            <View style={styles.avatarContainer}>
                                <Avatar
                                    size={60}
                                    shape="circle"
                                    source={{ uri: item.avatar }}
                                />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text numberOfLines={1} style={styles.contactName}>{`${item.given_name} ${item.family_name}`}</Text>
                                <Text numberOfLines={1} style={styles.contactEmail}>{item.email}</Text>
                            </View>
                            <View style={styles.actionsContainer}>
                                {item.isContact ? (
                                    <Button
                                        style={styles.actionButton}
                                        onPress={() => blockContact(item)}
                                        size="small"
                                        icon={!item.isBlocked ? "unlock" : "lock"}
                                        iconSize={28}
                                        iconLibrary="feather"
                                        textColor={!item.isBlocked ? colors.info : colors.danger}
                                    />
                                ) : null}
                                <Button
                                    style={styles.actionButton}
                                    onPress={() => addContact(item)}
                                    size="small"
                                    icon={item.isContact ? "minus" : "plus"}
                                    iconSize={28}
                                    iconLibrary="feather"
                                    textColor={item.isContact ? colors.danger : colors.success}
                                />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                />
            ) : (
                <View style={[styles.placeholderContainer, { alignItems: 'center' }]}>
                    <Image source={noResultsImage} style={styles.placeholderImage} />
                    <Text style={styles.placeholderText}>No results found</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'flex-start',
    },
    searchBarText: {
        color: "#fff",
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    contactList: {
        flex: 1,
    },
    contact: {
        backgroundColor: colors.modalBackground,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    contactContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
    },
    avatarContainer: {
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    contactName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    contactEmail: {
        fontSize: 16,
        color: '#888',
    },
    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        backgroundColor: 'transparent',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    placeholderImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});