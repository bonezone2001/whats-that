// Blocked contact screen.
// Allow user to view and unblock blocked contacts.

import {
    View,
    Text,
    FlatList,
    Image,
} from 'react-native';
import ContactCard from '@components/shared/contact_card';
import React, { useEffect, useState } from 'react';
import { useScreenHeader } from '@hooks';
import { contactStyle } from '@styles';
import { useStore } from '@store';
import { t } from '@locales';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';

export default function ContactBlockedScreen() {
    const [blocked, setBlocked] = useState([]);
    const store = useStore();

    useScreenHeader({ title: t('screens.contact.blocked.title') });

    useEffect(() => {
        if (store.blocked?.length === 0) return;
        api.getAccompanyingPhotos(store.blocked).then((results) => {
            setBlocked(results.map((result) => ({ ...result, isBlocked: true })));
        });
    }, [store.blocked]);

    return (
        <View style={contactStyle.container}>
            {blocked.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={blocked}
                    renderItem={({ item }) => <ContactCard type="block" contact={item} />}
                    keyExtractor={(item) => item.user_id.toString()}
                />
            ) : (
                <View style={[contactStyle.placeholderContainer, { alignItems: 'center' }]}>
                    <Image source={noResultsImage} style={contactStyle.placeholderImage} />
                    <Text style={contactStyle.placeholderText}>{t('screens.contact.blocked.no_blocked')}</Text>
                </View>
            )}
        </View>
    );
}
