import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

import ContactCard from './contact_card';
import { colors } from '@styles';

export default function ContactSelectionBox({
    contacts,
    selectedContacts,
    setSelectedContacts,
    onContactSelection,
}) {
    const toggleContactSelection = (contact) => {
        const index = selectedContacts.findIndex((c) => c.user_id === contact.user_id);
        if (index > -1) {
            // Contact is already selected, so remove it from the list
            setSelectedContacts(selectedContacts.filter((c) => c.user_id !== contact.user_id));
        } else {
            // Contact is not yet selected, so add it to the list
            setSelectedContacts([...selectedContacts, contact]);
        }
        if (onContactSelection) onContactSelection(contact);
    };

    return (
        <View style={styles.container}>
            {contacts.map((contact) => (
                <TouchableOpacity
                    key={contact.user_id}
                    onPress={() => toggleContactSelection(contact)}
                >
                    <ContactCard
                        type="none"
                        contact={contact}
                        avatarSize={40}
                        displayEmail={false}
                        style={[
                            styles.contact,
                            selectedContacts.some((c) => c.user_id === contact.user_id) && styles.selectedContact,
                        ]}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    contact: {
        marginBottom: 10,
        width: '100%',
    },
    selectedContact: {
        backgroundColor: colors.secondary,
    },
});

ContactSelectionBox.propTypes = {
    contacts: PropTypes.array.isRequired,
    selectedContacts: PropTypes.array.isRequired,
    setSelectedContacts: PropTypes.func.isRequired,
    onContactSelection: PropTypes.func,
};

ContactSelectionBox.defaultProps = {
    onContactSelection: null,
};
