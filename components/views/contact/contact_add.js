import {
    View,
    Text,
    FlatList,
    Image,
    Platform,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { contactStyle } from '@styles';
import { useStore } from '@store';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';
import ContactCard from '@components/shared/contact_card';
import { appUtils } from '@utils';
import Button from '@components/shared/button';
import TextInput from '@components/shared/text_input';
import { useNavigation } from '@react-navigation/native';

export default function ContactView() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const store = useStore();

    const searchForContact = async (query) => {
        if (query.length === 0) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await api.searchUsers(query);
            const contacts = response.data.filter((user) => user.user_id !== store.userId);
            for (let i = 0; i < contacts.length; i++) {
                const user = contacts[i];
                const avatarData = await api.getUserPhoto(user.user_id);
                user.avatar = avatarData;

                // Remap given_name and family_name to first_name and last_name
                user.first_name = user.given_name;
                user.last_name = user.family_name;
                delete user.given_name;
                delete user.family_name;

                // Search if array of objects includes users with matching user_id
                if (store.contacts) user.isContact = store.contacts.some((contact) => contact.user_id === user.user_id);
                if (store.blocked) user.isBlocked = store.blocked.some((blocked) => blocked.user_id === user.user_id);
            }
            setSearchResults(contacts);
        } catch (error) {
            console.log(error);
        }
    };

    // Delay calling searchForContact to prevent spamming the server with incomplete queries
    // useCallback is used to prevent the debounce function from being recreated on every render (due to the loading update)
    const debouncedSearch = useCallback(
        appUtils.debounce(async (query) => {
            searchForContact(query);
            setLoading(false);
        }, 250),
        []
    );

    // Show loading indicator while waiting for debounce and search
    const search = useCallback(
        (query) => {
            setLoading(true);
            debouncedSearch(query);
        },
        [debouncedSearch],
    );

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
                <View style={contactStyle.searchBar}>
                    <TextInput
                        placeholder="Search"
                        icon="search"
                        loading={loading}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            search(text);
                        }}
                        style={{
                            width: Platform.OS === 'android' ? '90%' : '100%',
                        }}
                        value={searchQuery}
                    />
                </View>
            ),
        });
    }, [setSearchResults, store, loading, searchQuery]);

    return (
        <View style={contactStyle.container}>
            {searchResults.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={searchResults}
                    renderItem={({ item }) => <ContactCard type="add" contact={item} />}
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
