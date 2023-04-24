import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";
import TextInput from "@components/shared/text_input";
import Avatar from "@components/shared/avatar";
import Button from "@components/shared/button";
import { colors, globalStyle } from "@styles";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useStore } from "@store";
import api from "@api";

export default () => {
    const [searchResults, setSearchResults] = useState([]);
    const navigation = useNavigation();
    const store = useStore();

    // Will turn into debounced function soon
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
            }
            setSearchResults(contacts);
        } catch (error) {
            console.log(error);
        }
    };

    const addContact = async (userId) => {
        try {
            await api.addContact(userId);
            console.log("Added contact!");
        } catch (error) {
            console.log(error);
        }
    };

    const blockContact = async (userId) => {
        console.log(userId);
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
                        onChangeText={searchForContact}
                    />
                </View>
            ),
        });
    }, [setSearchResults]);
    
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
                                <Button
                                    style={styles.actionButton}
                                    onPress={() => blockContact(item.user_id)}
                                    size="small"
                                    icon="x-circle"
                                    iconSize={28}
                                    iconLibrary="feather"
                                />
                                <Button
                                    style={styles.actionButton}
                                    onPress={() => addContact(item.user_id)}
                                    size="small"
                                    icon="plus"
                                    iconSize={28}
                                    iconLibrary="feather"
                                />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                />
            ) : (
                <View style={[styles.contactContainer, { width: "100%" }]}>
                    <Text style={styles.contactName}>No results found</Text>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    searchBarText: {
        color: "#fff",
        fontSize: 18,
        backgroundColor: 'transparent'        
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
        backgroundColor: colors.modalBackground,
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
});