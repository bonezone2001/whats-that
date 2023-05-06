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
import Button from '@components/shared/button';
import { useScreenHeader } from '@hooks';
import { contactStyle } from '@styles';
import { useStore } from '@store';
import { t } from '@locales';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';

export default function ContactViewScreen() {
    const [contacts, setContacts] = useState([]);
    const store = useStore();

    useScreenHeader({
        left: null,
        title: t('screens.contact.view.title'),
        right: (
            <View style={{ flexDirection: 'row' }}>
                <Button
                    mode="text"
                    icon="x-circle"
                    prefixSize={28}
                    href="Blocked"
                    accessibilityLabel={t('screens.contact.view.blocked_button')}
                />
                <Button
                    mode="text"
                    icon="user-plus"
                    prefixSize={28}
                    href="Add"
                    accessibilityLabel={t('screens.contact.view.add_button')}
                />
            </View>
        ),
    });

    useEffect(() => {
        api.getAccompanyingPhotos(store.contacts).then((results) => {
            setContacts(results.map((result) => ({ ...result, isContact: true })));
        });
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
                    <Text style={contactStyle.placeholderText}>{t('screens.contact.view.no_contacts')}</Text>
                </View>
            )}
        </View>
    );
}
