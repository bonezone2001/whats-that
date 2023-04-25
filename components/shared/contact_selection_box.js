import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Avatar from "@components/shared/avatar";
import { colors } from "@styles";

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
            <View style={styles.contactsContainer}>
                {contacts.map((contact) => (
                    <TouchableOpacity
                        key={contact.user_id}
                        style={[
                            styles.contact,
                            selectedContacts.some((c) => c.user_id === contact.user_id) && styles.selectedContact,
                        ]}
                        onPress={() => toggleContactSelection(contact)}
                    >
                        <Avatar
                            size={40}
                            shape="circle"
                            source={{ uri: contact.avatar }}
                            style={styles.avatar}
                        />
                        <View style={styles.contactDetails}>
                            <Text numberOfLines={1} style={styles.contactName}>{contact.first_name} {contact.last_name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    contactsContainer: {
        flexDirection: "column",
    },
    contact: {
        backgroundColor: "#fff",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        padding: 10,
        width: "100%",
    },
    selectedContact: {
        backgroundColor: colors.secondary,
    },
    avatar: {
        marginRight: 10,
    },
    contactDetails: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    contactEmail: {
        fontSize: 14,
    },
});