// Card for controlling and displaying a contact.
// Information includes avatar, name, email, and buttons for adding/removing/blocking.

import Avatar from '@components/shared/avatar';
import { colors, contactStyle } from '@styles';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { apiUtils } from '@utils';
import React from 'react';
import api from '@api';

import Button from './button';

export default function ContactCard({
    type,
    contact,
    avatarSize,
    displayEmail,
    style,
}) {
    const handleBlock = async () => {
        try {
            if (contact.isBlocked) {
                await api.unblockUser(contact.user_id);
            } else {
                await api.blockUser(contact.user_id);
            }
            // eslint-disable-next-line no-param-reassign
            contact.isBlocked = !contact.isBlocked;
            // eslint-disable-next-line no-param-reassign
            contact.isContact = !contact.isBlocked;
            await apiUtils.updateContactsAndBlocked();
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddOrRemove = async () => {
        try {
            if (contact.isContact) {
                await api.removeContact(contact.user_id);
            } else {
                await api.addContact(contact.user_id);
            }
            // eslint-disable-next-line no-param-reassign
            contact.isContact = !contact.isContact;
            await apiUtils.updateContacts();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={[contactStyle.contact, style]}>
            <View style={contactStyle.avatarContainer}>
                <Avatar
                    size={avatarSize}
                    shape="circle"
                    source={{ uri: contact.avatar }}
                />
            </View>
            <View style={contactStyle.infoContainer}>
                <Text numberOfLines={1} style={contactStyle.name}>
                    {`${contact.first_name} ${contact.last_name}`}
                </Text>
                {displayEmail ? (
                    <Text numberOfLines={1} style={contactStyle.email}>
                        {contact.email}
                    </Text>
                ) : null}
            </View>
            {/* If type is none, don't render actions */}
            {
                type === 'none' ? null : (
                    <View style={contactStyle.actionsContainer}>
                        {(contact.isContact || contact.isBlocked) ? (
                            <Button
                                onPress={handleBlock}
                                style={contactStyle.actionButton}
                                icon={!contact.isBlocked ? 'unlock' : 'lock'}
                                prefixSize={28}
                                textColor={!contact.isBlocked ? colors.info : colors.danger}
                            />
                        ) : null}
                        {(type !== 'block' && !contact.isBlocked) ? (
                            <Button
                                onPress={handleAddOrRemove}
                                style={contactStyle.actionButton}
                                icon={contact.isContact ? 'minus' : 'plus'}
                                prefixSize={28}
                                textColor={contact.isContact ? colors.danger : colors.success}
                            />
                        ) : null}
                    </View>
                )
            }
        </View>
    );
}

ContactCard.propTypes = {
    type: PropTypes.oneOf(['none', 'block', 'view', 'add']),
    contact: PropTypes.shape({
        user_id: PropTypes.number,
        avatar: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        email: PropTypes.string,
        isContact: PropTypes.bool,
        isBlocked: PropTypes.bool,
    }).isRequired,
    avatarSize: PropTypes.number,
    displayEmail: PropTypes.bool,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};

ContactCard.defaultProps = {
    type: 'none',
    avatarSize: 60,
    displayEmail: true,
    style: {},
};
