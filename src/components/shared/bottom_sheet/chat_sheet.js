// Bottom sheet displayed on chats.
// Allows for modifying chats, adding members, and leaving chats.

import { useNavigation } from '@react-navigation/native';
import Button from '@components/shared/button';
import Toast from 'react-native-toast-message';
import { globalStyle } from '@styles';
import PropTypes from 'prop-types';
import { useStore } from '@store';
import { apiUtils } from '@utils';
import { t } from '@locales';
import React from 'react';
import api from '@api';

export const settings = {
    parentRouteName: 'Chat',
    sheetPercent: (route) => {
        const store = useStore.getState();
        if (route?.params?.chat?.creator?.user_id === store?.user?.user_id) {
            return 33;
        }
        return 14;
    },
};

export function sheet({ route }) {
    const navigation = useNavigation();
    const store = useStore();

    return (
        <>
            {route?.params?.chat?.creator?.user_id === store?.user?.user_id && (
                <>
                    <Button
                        mode="text"
                        icon="edit"
                        style={globalStyle.sheetButton}
                        onPress={() => {
                            navigation.navigate('Modify', {
                                chat: route.params.chat,
                            });
                        }}
                    >
                        {/* Modify Chat */}
                        {t('components.bottom_sheet.chat.modify_chat')}
                    </Button>
                    <Button
                        mode="text"
                        icon="user-plus"
                        style={globalStyle.sheetButton}
                        onPress={() => {
                            navigation.navigate('Members', {
                                chat: route.params.chat,
                                isAdd: true,
                            });
                        }}
                    >
                        {/* Add Members */}
                        {t('components.bottom_sheet.chat.add_members')}
                    </Button>
                    <Button
                        mode="text"
                        icon="user-minus"
                        style={globalStyle.sheetButton}
                        onPress={() => {
                            navigation.navigate('Members', {
                                chat: route.params.chat,
                                isAdd: false,
                            });
                        }}
                    >
                        {/* Kick Members */}
                        {t('components.bottom_sheet.chat.kick_members')}
                    </Button>
                </>
            )}
            <Button
                mode="text"
                icon="log-out"
                style={globalStyle.sheetButton}
                onPress={async () => {
                    try {
                        await api.removeUserFromChat(
                            route?.params.chat.chat_id,
                            store.user.user_id,
                        );
                        apiUtils.updateChats();
                        navigation.navigate('View');
                    } catch (error) {
                        Toast.show({
                            type: 'error',
                            text1: t('error'),
                            text2: t('components.bottom_sheet.chat.leave_chat_error'),
                        });
                    }
                }}
            >
                {t('components.bottom_sheet.chat.leave_chat')}
            </Button>
        </>
    );
}

sheet.propTypes = {
    route: PropTypes.object.isRequired,
};
