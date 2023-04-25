import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import InfoCard from "@components/shared/info_card";
import Button from "@components/shared/button";
import Avatar from "@components/shared/avatar";
import { Ionicons } from "@expo/vector-icons";
import { globalStyle } from "@styles";
import { useStore } from "@store";

export default () => {
    const navigation = useNavigation();
    const store = useStore();

    const onEditProfile = () => {
        navigation.navigate("Edit");
    };

    const onHamburgerPress = () => {
        store.bottomSheet.current?.expand();
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={onHamburgerPress}
                    style={globalStyle.transparent}
                    size="small"
                >
                    <Ionicons name="menu" size={38} color="#fff" />
                </Button>
            ),
            headerTitle: () => (
                <Text style={globalStyle.headerTitle}>Profile</Text>
            ),
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
                    <InfoCard
                        type="secondary"
                        shape="rounded"
                        icon="mail"
                        label="Email"
                        value={store.user.email}
                    />
                    <InfoCard
                        type="secondary"
                        shape="rounded"
                        icon="people"
                        label="Friends"
                        value={store.user.friends}
                    />
                    <InfoCard
                        type="secondary"
                        shape="rounded"
                        icon="chatbubbles"
                        label="Chats"
                        value={store.user.chats}
                    />
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
    
});