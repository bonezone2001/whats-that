import {
    View,
    Text,
    FlatList,
    Image,
} from 'react-native';
import ContactCard from '@components/shared/contact_card';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { contactStyle, globalStyle } from '@styles';
import Button from '@components/shared/button';
import { useStore } from '@store';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';

export default function ContactView() {
    const [blocked, setBlocked] = useState([]);
    const navigation = useNavigation();
    const store = useStore();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    mode="text"
                    icon="chevron-left"
                    prefixSize={40}
                    href="View"
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>Blocked</Text>
            ),
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
