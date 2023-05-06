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
import Toast from 'react-native-toast-message';
import { useScreenHeader } from '@hooks';
import { contactStyle } from '@styles';
import { appUtils } from '@utils';
import { useStore } from '@store';
import { t } from '@locales';
import api from '@api';

import noResultsImage from '@assets/images/no_results.png';

export default function ContactAddScreen() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const store = useStore();

    useScreenHeader({
        title: (
            <View style={contactStyle.searchBar}>
                <TextInput
                    placeholder={t('search')}
                    icon="search"
                    loading={loading}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        search(text, true);
                    }}
                    style={{ width: Platform.OS === 'android' ? '90%' : '100%' }}
                    value={searchQuery}
                />
            </View>
        ),
        args: [setSearchResults, store, loading, searchQuery],
    });

    const searchForContact = async (query, page = 1) => {
        if (query.length === 0) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await api.searchUsers(query, 'all', 20, (page - 1) * 20);
            const contacts = await api.getAccompanyingPhotos(response.data);

            // If there are no more results, set hasMore to false
            if (response?.data?.length < 20) {
                setCurrentPage(-1);
            }

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

            if (page === 1) {
                setSearchResults(contacts);
            } else {
                setSearchResults(searchResults.concat(contacts));
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    // Delay calling searchForContact to prevent spamming the server with incomplete queries
    const debouncedSearch = useCallback(
        appUtils.debounce(async (query, page) => {
            searchForContact(query, page);
            setLoading(false);
        }, 250),
        [],
    );

    // Show loading indicator while waiting for debounce and search
    const search = useCallback(
        async (query, isDebounced = false, page = 1) => {
            setLoading(true);
            if (isDebounced) {
                setCurrentPage(1);
                debouncedSearch(query, page);
            } else {
                await searchForContact(query, page);
                setLoading(false);
            }
        },
        [debouncedSearch, currentPage, searchResults],
    );

    return (
        <View style={contactStyle.container}>
            {searchResults.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={searchResults}
                    keyExtractor={(item) => item.user_id.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={async () => {
                        if (currentPage > 0 && searchResults.length >= 20) {
                            setCurrentPage(currentPage + 1);
                            search(searchQuery, false, currentPage + 1);
                        }
                    }}
                    renderItem={({ item }) => (
                        <ContactCard
                            type={item.user_id === store.user.user_id ? 'none' : 'add'}
                            contact={item}
                        />
                    )}
                />
            ) : (
                <View style={[contactStyle.placeholderContainer, { alignItems: 'center' }]}>
                    <Image source={noResultsImage} style={contactStyle.placeholderImage} />
                    <Text style={contactStyle.placeholderText}>{t('screens.contact.add.no_results')}</Text>
                </View>
            )}
        </View>
    );
}
