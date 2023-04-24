import { View, Text, StyleSheet, Image } from "react-native";
import { colors, contactStyle, globalStyle } from "@styles";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import TextInput from "@components/shared/text_input";
import Avatar from "@components/shared/avatar";
import Button from "@components/shared/button";
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
            await apiUtils.updateContacts();
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
            user.isContact = !user.isBlocked;
            await apiUtils.updateContactsAndBlocked();
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
                <View style={contactStyle.searchBar}>
                    <TextInput
                        style={contactStyle.searchBarText}
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
        <View style={contactStyle.container}>
            {searchResults.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={searchResults}
                    renderItem={({ item }) => (
                        <View style={contactStyle.contact}>
                            <View style={contactStyle.avatarContainer}>
                                <Avatar
                                    size={60}
                                    shape="circle"
                                    source={{ uri: item.avatar }}
                                />
                            </View>
                            <View style={contactStyle.infoContainer}>
                                <Text numberOfLines={1} style={contactStyle.name}>{`${item.given_name} ${item.family_name}`}</Text>
                                <Text numberOfLines={1} style={contactStyle.email}>{item.email}</Text>
                            </View>
                            <View style={contactStyle.actionsContainer}>
                                {(item.isContact || item.isBlocked) ? (
                                    <Button
                                        style={contactStyle.actionButton}
                                        onPress={() => blockContact(item)}
                                        size="small"
                                        icon={!item.isBlocked ? "unlock" : "lock"}
                                        iconSize={28}
                                        iconLibrary="feather"
                                        textColor={!item.isBlocked ? colors.info : colors.danger}
                                    />
                                ) : null}
                                {!item.isBlocked ? (
                                    <Button
                                        style={contactStyle.actionButton}
                                        onPress={() => addContact(item)}
                                        size="small"
                                        icon={item.isContact ? "minus" : "plus"}
                                        iconSize={28}
                                        iconLibrary="feather"
                                        textColor={item.isContact ? colors.danger : colors.success}
                                    />
                                ) : null}
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                />
            ) : (
                <View style={[contactStyle.placeholderContainer, { alignItems: 'center' }]}>
                    <Image source={noResultsImage} style={contactStyle.placeholderImage} />
                    <Text style={contactStyle.placeholderText}>No results found</Text>
                </View>
            )}
        </View>
    );
}