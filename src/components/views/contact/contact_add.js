// Add contact screen.
// Allow user to search for and add/block contacts.

import {
    View,
    Text,
    FlatList,
    Image,
    Platform,
} from 'react-native';
import ContactCard from '@components/shared/contact_card';
import TextInput from '@components/shared/text_input';
import React, { useCallback, useState } from 'react';
import { useScreenHeader } from '@hooks';
import { contactStyle } from '@styles';
import { appUtils } from '@utils';
import { useStore } from '@store';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';

export default function ContactAddScreen() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const store = useStore();

    useScreenHeader({
        title: (
            <View style={contactStyle.searchBar}>
                <TextInput
                    placeholder="Search"
                    icon="search"
                    loading={loading}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        search(text);
                    }}
                    style={{ width: Platform.OS === 'android' ? '90%' : '100%' }}
                    value={searchQuery}
                />
            </View>
        ),
        args: [setSearchResults, store, loading, searchQuery],
    });

    const searchForContact = async (query) => {
        if (query.length === 0) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await api.searchUsers(query);
            const contactsTemp = response.data.filter((user) => user.user_id !== store.userId);
            const contacts = await api.getAccompanyingPhotos(contactsTemp);

            // Update all to appropriate format
            for (let i = 0; i < contacts.length; i++) {
                const user = contacts[i];

                // Remap given_name and family_name to first_name and last_name
                user.first_name = user.given_name;
                user.last_name = user.family_name;
                delete user.given_name;
                delete user.family_name;

                // Search if array of objects includes users with matching user_id
                if (store.contacts) {
                    user.isContact = store.contacts.some(
                        (contact) => contact.user_id === user.user_id,
                    );
                }

                if (store.blocked) {
                    user.isBlocked = store.blocked.some(
                        (blocked) => blocked.user_id === user.user_id,
                    );
                }
            }
            setSearchResults(contacts);
        } catch (error) {
            console.log(error);
        }
    };

    // Delay calling searchForContact to prevent spamming the server with incomplete queries
    const debouncedSearch = useCallback(
        appUtils.debounce(async (query) => {
            searchForContact(query);
            setLoading(false);
        }, 250),
        [],
    );

    // Show loading indicator while waiting for debounce and search
    const search = useCallback(
        (query) => {
            setLoading(true);
            debouncedSearch(query);
        },
        [debouncedSearch],
    );

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
