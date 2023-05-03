// Create chat screen.
// Allows users to create a chat w or w/o contacts selected.
// Takes user to the new chat after creation.

import {
    View,
    Text,
    ScrollView,
    Dimensions,
} from 'react-native';
import ContactSelectionBox from '@components/shared/contact_box';
import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import Button from '@components/shared/button';
import { colors, globalStyle } from '@styles';
import { useStore } from '@store';
import { apiUtils } from '@utils';
import api from '@api';

// Create chat screen
export default function ChatCreate() {
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [creating, setCreating] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [chatName, setChatName] = useState('');
    const navigation = useNavigation();
    const store = useStore();

    const handleCreateChat = async () => {
        try {
            if (!chatName.trim()) return;
            setCreating(true);
            const chat = (await api.createChat(chatName)).data;

            // Add all selected contacts to the chat asynchronously
            await Promise.allSettled(selectedContacts.map(
                async (contact) => api.addUserToChat(chat.chat_id, contact.user_id),
            ));

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
            <View style={{ width: '90%' }}>
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
