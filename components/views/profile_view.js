import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import InfoCard from "@components/shared/info_card";
import Button from "@components/shared/button";
import Avatar from "@components/shared/avatar";
import { globalStyle } from "@styles";
import { useStore } from "@store";
import { appUtils } from "@utils";

export default () => {
    const navigation = useNavigation();
    const store = useStore();

    const infoCards = useMemo(() => appUtils.getInfoCardData(store.user), [store.user]);
    const onHamburgerPress = () => store.bottomSheet.current?.expand();
    const onEditProfile = () => navigation.navigate("Edit");

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={onHamburgerPress}
                    style={globalStyle.transparent}
                    size="small"
                    icon="menu"
                    iconLibrary="ionicons"
                    iconSize={38}
                />
            ),
            headerTitle: () => <Text numberOfLines={1} style={globalStyle.headerTitle}>Profile</Text>,
        });
    }, [store.bottomSheet]);

    return (
        <View style={globalStyle.container}>
            <ScrollView style={globalStyle.contentContainer}>
                <View style={styles.profileHeader}>
                    <Avatar size={160} style={styles.avatar} shape="rounded" source={{ uri: store.user.avatar }} />
                    <Text style={styles.name}>{`${store.user.first_name} ${store.user.last_name}`}</Text>
                    <Button
                        block={45}
                        shape="rounded"
                        textColor="black"
                        style={styles.button}
                        onPress={onEditProfile}
                    >
                        Edit Profile
                    </Button>
                </View>

                <View style={styles.profileContent}>
                    {
                        infoCards.map((item, index) => (
                            <InfoCard
                                key={index}
                                type="secondary"
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                textColor="#eee"
                                style={styles.infoCard}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: "center",
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
    },
    name: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    avatar: {
        borderWidth: 2,
        borderColor: "#fff",
    },
    profileContent: {
        marginTop: 20,
    },
    infoCard: {
        backgroundColor: "transparent",
        borderBottomWidth: 1,
    }
});