import ContactSelectionBox from "@components/shared/contact_selection_box";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { globalStyle } from "@styles";
import { useNavigation } from "@react-navigation/native";
import Button from "@components/shared/button";
import TextInput from "@components/shared/text_input";
import { useEffect, useState } from "react";
import { useStore } from "@store";
import api from "@api";
import { apiUtils } from "@utils";

// Create chat screen
export default () => {
    const navigation = useNavigation();
    const store = useStore();
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [chatName, setChatName] = useState("");

    const handleCreateChat = async () => {
        try {
            const chat = (await api.createChat(chatName)).data;

            // Add all selected contacts to the chat asynchronously
            await Promise.allSettled(selectedContacts.map(async (contact) => {
                return await api.addUserToChat(chat.chat_id, contact.user_id);
            }));

            // Navigate to new chat
            const chatDetails = (await api.getChatDetails(chat.chat_id)).data;
            navigation.navigate("ViewChat", { chat: chatDetails });
        } catch (error) {
            console.log(error);
        } finally {
            await apiUtils.updateChats();
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate("View")}
                    style={globalStyle.transparent}
                    size="small"
                    icon="chevron-left"
                    iconLibrary="Feather"
                    iconSize={40}
                    textColor="#fff"
                />
            ),
        });
    }, []);

    useEffect(() => {
        Promise.all(store.contacts?.map(async (contact) => {
            const avatarData = await api.getUserPhoto(contact.user_id);
            contact.avatar = avatarData;
            return contact;
        })).then((contacts) => {
            setContacts(contacts);
        });
    }, [store.contacts]);

    return (
        <View style={globalStyle.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Create Chat</Text>

                <TextInput
                    placeholder="Name of chat"
                    style={styles.textInput}
                    textColor="black"
                    shape="rounded"
                    value={chatName}
                    onChangeText={setChatName}
                />

                {/* Box for selecting the contacts that should be in the chat */}
                <Text style={styles.subtitle}>Select contacts</Text>
                
                {/* Box to limit size of contact view, set as remaining height */}
                <ScrollView style={{ maxHeight: Dimensions.get("window").height - 450 }}>
                    <ContactSelectionBox
                        contacts={contacts}
                        selectedContacts={selectedContacts}
                        setSelectedContacts={setSelectedContacts}
                    />
                </ScrollView>

                <Button
                    onPress={handleCreateChat}
                    type="primary"
                    shape="rounded"
                    size="small"
                >
                    <Text style={{ color: "#fff", fontSize: 20 }}>Create</Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: "80%",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
        marginLeft: 8,
    },
    textInput: {
        backgroundColor: "#fff",
    },
});