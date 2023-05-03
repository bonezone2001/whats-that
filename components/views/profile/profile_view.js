// Edit profile screen.
// Allow editing of user email, first name, last name, and avatar.

import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyle, profileStyle } from '@styles';
import InfoCard from '@components/shared/info_card';
import React, { useEffect, useMemo } from 'react';
import Avatar from '@components/shared/avatar';
import Button from '@components/shared/button';
import { appUtils } from '@utils';
import { useStore } from '@store';

export default function ProfileViewScreen() {
    const navigation = useNavigation();
    const store = useStore();

    const infoCards = useMemo(() => appUtils.getInfoCardData(store.user, store.contacts, store.chats), [store.user, store.contacts, store.chats]);
    const onHamburgerPress = () => store.bottomSheet?.current?.expand();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    mode="text"
                    onPress={onHamburgerPress}
                    icon="menu"
                    iconLibrary="ionicons"
                    prefixSize={38}
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>Profile</Text>
            ),
        });
    }, []);

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
                        Edit Profile
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
