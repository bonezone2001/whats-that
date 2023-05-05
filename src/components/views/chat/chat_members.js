// Chat modify members screen.
// Allow chat creator to add or remove members from a chat.

import {
    View,
    ScrollView,
    Dimensions,
} from 'react-native';
import { BackButton, CheckLoad, HeaderTitle } from '@components/shared/headers';
import ContactSelectionBox from '@components/shared/contact_box';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { globalStyle } from '@styles';
import PropTypes from 'prop-types';
import { useStore } from '@store';
import api from '@api';

export default function ChatMembers({ route }) {
    const { chat, isAdd } = route.params;

    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [updating, setUpdating] = useState(false);
    const navigation = useNavigation();
    const store = useStore();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <BackButton href="View" />,
            headerTitle: () => <HeaderTitle title={isAdd ? 'Add Members' : 'Kick Members'} />,
            headerRight: () => (
                <CheckLoad
                    loading={updating}
                    disabled={!selectedContacts.length}
                    onPress={handleModifyMembers}
                />
            ),
        });
    }, [contacts, selectedContacts]);

    // If isAdd is true, add contacts to chat, otherwise remove contacts from chat
    const handleModifyMembers = async () => {
        try {
            setUpdating(true);
            const operationFunc = isAdd ? api.addUsersToChat : api.removeUsersFromChat;
            await operationFunc(
                chat.chat_id,
                selectedContacts.map((contact) => contact.user_id),
            );
            navigation.navigate('View');
        } catch (error) {
            console.log(error);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const userContacts = store.contacts;
                const { members } = (await api.getChatDetails(chat.chat_id)).data;

                // Filter out contacts that are already in the chat if adding members
                const contactsToDisplay = isAdd
                    ? userContacts.filter(
                        (contact) => !members.some((member) => member.user_id === contact.user_id),
                    )
                    : members.filter((member) => member.user_id !== store.user.user_id);

                api.getAccompanyingPhotos(contactsToDisplay).then((results) => {
                    setContacts(results);
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }, [isAdd]);

    return (
        <View style={globalStyle.container}>
            <View style={{ width: '90%' }}>
                {/* Box to limit size of contact view, set as remaining height */}
                <ScrollView style={{ maxHeight: Dimensions.get('window').height * 0.6 }}>
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

ChatMembers.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            chat: PropTypes.shape({
                chat_id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
            isAdd: PropTypes.bool.isRequired,
        }).isRequired,
    }).isRequired,
};