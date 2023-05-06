// Create chat screen.
// Allows users to create a chat w or w/o contacts selected.
// Takes user to the new chat after creation.

import ContactSelectionBox from '@components/shared/contact_box';
import { View, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckLoad } from '@components/shared/headers';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useScreenHeader } from '@hooks';
import { globalStyle } from '@styles';
import { apiUtils } from '@utils';
import { useStore } from '@store';
import { t } from '@locales';
import api from '@api';

export default function ChatCreate() {
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [creating, setCreating] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [chatName, setChatName] = useState('');

    const navigation = useNavigation();
    const store = useStore();

    const handleCreateChat = async () => {
        try {
            const trimmedName = chatName.trim();
            if (!trimmedName) return;
            setCreating(true);

            const chat = (await api.createChat(trimmedName)).data;
            await api.addUsersToChat(
                chat.chat_id,
                selectedContacts.map((contact) => contact.user_id),
            );

            navigation.navigate('ViewChat', {
                chat: {
                    ...(await api.getChatDetails(chat.chat_id)).data,
                    chat_id: chat.chat_id,
                },
            });
        } catch (error) {
            Toast.show({
                text1: t('screens.chat.create.handleCreateChat_error'),
                text2: error.message,
                type: 'error',
            });
        } finally {
            setCreating(false);
            apiUtils.updateChats();
        }
    };

    useScreenHeader({
        title: t('screens.chat.create.title'),
        right: (
            <CheckLoad
                onPress={handleCreateChat}
                loading={creating}
                disabled={!chatName.trim()}
            />
        ),
        args: [chatName, selectedContacts],
    });

    useEffect(() => {
        api.getAccompanyingPhotos(store.contacts)
            .then(setContacts);
    }, [store.contacts]);

    return (
        <View style={globalStyle.container}>
            <View style={{ width: '90%' }}>
                <TextInput label={t('screens.chat.create.name_of_chat')} value={chatName} onChangeText={setChatName} />

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
