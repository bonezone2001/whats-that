// Blocked contact screen.
// Allow user to view and unblock blocked contacts.

import {
    View,
    Text,
    FlatList,
    Image,
} from 'react-native';
import { BackButton, HeaderTitle } from '@components/shared/headers';
import ContactCard from '@components/shared/contact_card';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { contactStyle } from '@styles';
import { useStore } from '@store';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';

export default function ContactBlockedScreen() {
    const [blocked, setBlocked] = useState([]);
    const navigation = useNavigation();
    const store = useStore();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <BackButton href="View" />,
            headerTitle: () => <HeaderTitle title="Blocked" />,
        });
    }, []);

    useEffect(() => {
        if (store.blocked?.length === 0) return;
        Promise.all(store.blocked?.map(async (contact) => {
            const avatarData = await api.getUserPhoto(contact.user_id);
            return { ...contact, avatar: avatarData, isBlocked: true };
        }) || []).then((results) => {
            setBlocked(results);
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
                    <Text style={contactStyle.placeholderText}>No results found</Text>
                </View>
            )}
        </View>
    );
}
