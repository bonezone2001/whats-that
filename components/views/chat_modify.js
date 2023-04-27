// Screen for modifying the chat name and adding/removing users
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TextInput from "@components/shared/text_input";
import Button from "@components/shared/button";
import Avatar from "@components/shared/avatar";
import { colors, globalStyle } from "@styles";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { entryUtils } from "@utils";
import { useStore } from "@store";
import api from "@api";

export default ({ route, navigation }) => {
    const { chat } = route.params;

    const [updating, setUpdating] = useState(false);
    const [name, setName] = useState(chat.name);
    const [error, setError] = useState("");
    const store = useStore();

    const submitChanges = async () => {
        setError("");
        const errors = entryUtils.validateChatName(name);
        if (errors) {
            setError(errors);
            return;
        }
        
        try {
            setUpdating(true);
            await api.updateChatInfo(route.params.id, {
                name
            });

            store.updateChat(route.params.id, {
                name
            });
            navigation.goBack();
        } catch (error) {
            if (error?.response?.data)
                setError(error.response.data);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={submitChanges}
                    style={globalStyle.transparent}
                    size="small"
                >
                    {updating ? (
                        <ActivityIndicator size={35} color={colors.secondary} />
                    ) : (
                        <Feather name="check" size={40} color={colors.secondary} />
                    )}  
                </Button>
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>Edit Chat</Text>
            ),
            headerLeft: () => (
                <Button
                    onPress={() => navigation.goBack()}
                    style={globalStyle.transparent}
                    size="small"
                    icon="chevron-left"
                    iconLibrary="Feather"
                    iconSize={40}
                    textColor="#fff"
                />
            ),
        });
    }, [name, updating]);

    return (
        <View style={globalStyle.container}>
            <ScrollView style={globalStyle.contentContainer}>
                <View style={styles.profileHeader}>
                    <Avatar size={160} style={styles.avatar} shape="rounded" source={{ uri: route.params.avatar }} />
                    <Text style={styles.name}>{name}</Text>
                </View>

                <View style={styles.profileContent}>
                    <TextInput
                        placeholder="Chat name"
                        value={name}
                        shape="rounded"
                        onChangeText={setName}
                        style={styles.input}
                        error={error}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 20,
    },
    profileContent: {
        paddingHorizontal: 20,
    },
    input: {
        marginBottom: 20,
        backgroundColor: "#fff"
    },
});
