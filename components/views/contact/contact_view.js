// View contact list screen.
// Show all contacts and allow block/remove contact.

import {
    View,
    Text,
    FlatList,
    Image,
} from 'react-native';
import ContactCard from '@components/shared/contact_card';
import React, { useEffect, useState } from 'react';
import { contactStyle } from '@styles';
import { useStore } from '@store';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';

export default function ContactView() {
    const [contacts, setContacts] = useState([]);
    const store = useStore();

    useEffect(() => {
        Promise.all(store.contacts?.map(async (contact) => {
            const avatarData = await api.getUserPhoto(contact.user_id);
            return { ...contact, avatar: avatarData, isContact: true };
        }) || [])
            .then((result) => setContacts(result));
    }, [store.contacts]);

    return (
        <View style={contactStyle.container}>
            {contacts.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={contacts}
                    renderItem={({ item }) => <ContactCard type="view" contact={item} />}
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
