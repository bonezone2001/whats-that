import ContactSelectionBox from '@components/shared/contact_box';
import {
    View, Text, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import { colors, globalStyle } from '@styles';
import { useNavigation } from '@react-navigation/native';
import Button from '@components/shared/button';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import { useStore } from '@store';
import api from '@api';
import { apiUtils } from '@utils';

// Create chat screen
export default function ChatCreate() {
    const navigation = useNavigation();
    const store = useStore();
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [chatName, setChatName] = useState('');
    const [creating, setCreating] = useState(false);

    const handleCreateChat = async () => {
        try {
            if (!chatName.trim()) return;
            setCreating(true);
            const chat = (await api.createChat(chatName)).data;

            // Add all selected contacts to the chat asynchronously
            await Promise.allSettled(selectedContacts.map(async (contact) => await api.addUserToChat(chat.chat_id, contact.user_id)));

            // Navigate to new chat
            const chatDetails = (await api.getChatDetails(chat.chat_id)).data;
            chatDetails.chat_id = chat.chat_id;
            navigation.navigate('ViewChat', { chat: chatDetails });
        } catch (error) {
            console.log(error);
        } finally {
            setCreating(false);
            await apiUtils.updateChats();
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    mode="text"
                    icon="chevron-left"
                    prefixSize={38}
                    href="View"
                />
            ),
            headerRight: () => (
                <Button
                    mode="text"
                    onPress={handleCreateChat}
                    prefixSize={creating ? 34 : 38}
                    prefixColor={colors.secondary}
                    loading={creating}
                    icon="check"
                    disabled={creating || !chatName.trim()}
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>New Chat</Text>
            ),
        });
    }, [chatName, selectedContacts]);

    useEffect(() => {
        Promise.all(store.contacts?.map(async (contact) => {
            const avatarData = await api.getUserPhoto(contact.user_id);
            return { ...contact, avatar: avatarData };
        })).then((results) => {
            setContacts(results);
        });
    }, [store.contacts]);

    return (
        <View style={globalStyle.container}>
            <View style={styles.contentContainer}>
                <TextInput
                    label="Name of chat"
                    value={chatName}
                    onChangeText={setChatName}
                />

                {/* Box to limit size of contact view, set as remaining height */}
                <ScrollView style={{ marginTop: 20, maxHeight: Dimensions.get('window').height * 0.6 }}>
                    <ContactSelectionBox
                        contacts={contacts}
                        selectedContacts={selectedContacts}
                        setSelectedContacts={setSelectedContacts}
                    />
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        width: '90%',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        marginLeft: 8,
    },
});
