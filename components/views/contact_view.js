import { View, Text, FlatList, Image } from "react-native";
import Avatar from "@components/shared/avatar";
import { useEffect, useState } from "react";
import { contactStyle } from "@styles";
import { useStore } from "@store";
import api from "@api";

import noResultsImage from '@assets/images/no_results.png';

export default () => {
    const [contacts, setContacts] = useState([]);
    const store = useStore();

    useEffect(() => {
        Promise.all(store.contacts.map(async (contact) => {
            const avatarData = await api.getUserPhoto(contact.user_id);
            contact.avatar = avatarData;
            return contact;
        })).then((contacts) => {
            setContacts(contacts);
        });
    }, [store.contacts]);
    
    return (
        <View style={contactStyle.container}>
            {contacts.length > 0 ? (
                <FlatList
                    style={contactStyle.contactList}
                    data={contacts}
                    renderItem={({ item }) => (
                        <View style={contactStyle.contact}>
                            <View style={contactStyle.avatarContainer}>
                                <Avatar
                                    size={60}
                                    shape="circle"
                                    source={{ uri: item.avatar }}
                                />
                            </View>
                            <View style={contactStyle.infoContainer}>
                                <Text numberOfLines={1} style={contactStyle.name}>{`${item.first_name} ${item.last_name}`}</Text>
                                <Text numberOfLines={1} style={contactStyle.email}>{item.email}</Text>
                            </View>
                        </View>
                    )}
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