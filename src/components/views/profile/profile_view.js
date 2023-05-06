// Edit profile screen.
// Allow editing of user email, first name, last name, and avatar.

import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import { globalStyle, profileStyle } from '@styles';
import InfoCard from '@components/shared/info_card';
import Avatar from '@components/shared/avatar';
import Button from '@components/shared/button';
import { useScreenHeader } from '@hooks';
import React, { useMemo } from 'react';
import { appUtils } from '@utils';
import { useStore } from '@store';
import { t } from '@locales';

export default function ProfileViewScreen() {
    const store = useStore();

    const infoCards = useMemo(() => appUtils
        .getInfoCardData(
            store.user,
            store.contacts,
            store.chats,
        ), [store.user, store.contacts, store.chats]);

    useScreenHeader({
        left: null,
        title: t('screens.profile.view.title'),
        right: (
            <Button
                mode="text"
                icon="menu"
                iconLibrary="ionicons"
                prefixSize={38}
                onPress={() => store.bottomSheet?.current?.expand()}
            />
        ),
    });

    return (
        <View style={globalStyle.container}>
            <ScrollView style={globalStyle.contentContainer}>
                <View style={{ alignItems: 'center' }}>
                    <Avatar
                        source={{ uri: store.user?.avatar }}
                        style={profileStyle.avatar}
                        size={150}
                    />
                    <Text style={profileStyle.name}>{`${store.user?.first_name} ${store.user?.last_name}`}</Text>
                    <Button
                        mode="contained"
                        block={45}
                        shape="rounded"
                        textColor="black"
                        style={profileStyle.button}
                        href="Edit"
                    >
                        {t('screens.profile.view.edit_text')}
                    </Button>
                </View>
                <View style={{ marginTop: 20 }}>
                    {
                        infoCards.map((item) => (
                            <InfoCard
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                textColor="#eee"
                                style={profileStyle.infoCard}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    );
}
