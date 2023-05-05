// Chat modify screen.
// Allow chat creator to modify chat name.

import { BackButton, CheckLoad, HeaderTitle } from '@components/shared/headers';
import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import { globalStyle } from '@styles';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { apiUtils } from '@utils';
import api from '@api';

export default function ChatModify({ route }) {
    const { chat } = route.params;

    const navigation = useNavigation();
    const [chatName, setChatName] = useState(chat.name);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <BackButton href="View" />,
            headerTitle: () => <HeaderTitle title="Modify Chat" />,
            headerRight: () => (
                <CheckLoad
                    loading={updating}
                    onPress={handleModifyChat}
                    disabled={!chatName.length}
                />
            ),
        });
    }, [chatName, updating]);

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
