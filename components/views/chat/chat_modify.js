// Chat modify screen.
// Allow chat creator to modify chat name.

import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import Button from '@components/shared/button';
import { colors, globalStyle } from '@styles';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { apiUtils } from '@utils';
import api from '@api';

export default function ChatModify({ route }) {
    const { chat } = route.params;

    const navigation = useNavigation();
    const [chatName, setChatName] = useState(chat.name);
    const [updating, setUpdating] = useState(false);

    const handleModifyChat = async () => {
        try {
            setUpdating(true);
            await api.updateChat(chat.chat_id, chatName);
            apiUtils.updateChats();
            navigation.navigate('View');
        } catch (error) {
            console.log(error);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    mode="text"
                    icon="chevron-left"
                    prefixSize={38}
                    href="View"
                />
            ),
            headerRight: () => (
                <Button
                    mode="text"
                    onPress={handleModifyChat}
                    prefixSize={updating ? 34 : 38}
                    prefixColor={colors.secondary}
                    loading={updating}
                    icon="check"
                    disabled={updating || !chatName.length}
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>Modify Chat</Text>
            ),
        });
    }, [chatName, updating]);

    return (
        <View style={globalStyle.container}>
            <View style={{ width: '90%' }}>
                <TextInput
                    label="New name of chat"
                    value={chatName}
                    onChangeText={setChatName}
                />
            </View>
        </View>
    );
}

ChatModify.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            chat: PropTypes.shape({
                chat_id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
};
