import { useNavigation } from '@react-navigation/native';
import Button from '@components/shared/button';
import { globalStyle } from '@styles';
import PropTypes from 'prop-types';
import { useStore } from '@store';
import { apiUtils } from '@utils';
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
                        Modify Chat
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
                        Add Member
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
                        Remove Member
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
                        console.log(error);
                    }
                }}
            >
                Leave Chat
            </Button>
        </>
    );
}

sheet.propTypes = {
    route: PropTypes.object.isRequired,
};
