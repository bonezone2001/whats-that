import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TextInput from '@components/shared/text_input'
import * as ImagePicker from 'expo-image-picker';
import Button from "@components/shared/button";
import Avatar from "@components/shared/avatar";
import { colors, globalStyle } from "@styles";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { entryUtils } from "@utils";
import { useStore } from "@store";
import api from "@api";

// TODO: Redesign this page, as its ass cheeks (lame and cringe)
export default () => {
    const store = useStore();
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState(store.user.first_name);
    const [lastName, setLastName] = useState(store.user.last_name);
    const [email, setEmail] = useState(store.user.email);
    const [avatar, setAvatar] = useState(store.user.avatar);
    const [majorError, setMajorError] = useState("");
    const [updating, setUpdating] = useState(false);

    const submitChanges = async () => {
        setMajorError("");
        const errors = entryUtils.validateUpdateDetails(firstName, lastName, email);
        if (errors) {
            console.log("AA");
            setMajorError("Please provide valid details!")
            return;
        }
        
        try {
            setUpdating(true);
            await api.updateUserInfo(store.userId, {
                first_name: firstName,
                last_name: lastName,
                email
            });

            if (avatar !== store.user.avatar) {
                try {
                    await api.uploadUserPhoto(store.userId, avatar);
                } catch (error) {
                    console.log(error);
                }
            }
            
            store.setUser({
                ...store.user,
                first_name: firstName,
                last_name: lastName,
                email,
                avatar
            });
            navigation.navigate('View');   
        } catch (error) {
            if (error?.response?.data)
                setMajorError(error.response.data);
        } finally {
            setUpdating(false);
        }
    };

    const changeAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
            exif: false,
        });

        // Set base64 data uri
        if (!result.canceled) {
            setAvatar(`data:image/png;base64,${result.assets[0].base64}`);
        }
    };
    
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate("View")}
                    style={globalStyle.transparent}
                    size="small"
                >
                    <Feather name="x" size={40} color="#fff" />
                </Button>
            ),
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
        });
    }, [firstName, lastName, email, avatar, updating]);

    return (
        <View style={globalStyle.container}>
            <ScrollView style={globalStyle.contentContainer}>
                <View style={styles.profileHeader}>
                    <TouchableOpacity onPress={changeAvatar}>
                        <Avatar size={160} style={styles.avatar} shape="rounded" source={{ uri: avatar }} />
                        <Text style={styles.changeAvatar}>Edit picture or avatar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.profileContent}>
                    <View style={styles.inputs}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            shape="rounded"
                            style={styles.input}
                            textColor="black"
                            value={firstName}
                            onChangeText={(name) => setFirstName(entryUtils.sanitizeAndTrim(name))}
                            onValidate={() => entryUtils.validateName(firstName)}
                        />

                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            shape="rounded"
                            style={styles.input}
                            textColor="black"
                            value={lastName}
                            onChangeText={(name) => setLastName(entryUtils.sanitizeAndTrim(name))}
                            onValidate={() => entryUtils.validateName(lastName)}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            shape="rounded"
                            type="email-address"
                            style={styles.input}
                            textColor="black"
                            value={email}
                            onChangeText={(email) => setEmail(entryUtils.sanitizeEmail(email))}
                            onValidate={() => entryUtils.validateEmail(email)}
                        />
                        {majorError ? <Text style={globalStyle.errorText}>{majorError}</Text> : null}
                    </View>
            </View>
        </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#fff",
        marginTop: 10,
    },
    profileHeader: {
        alignItems: "center",
    },
    avatar: {
        borderWidth: 2,
        borderColor: "#fff",
    },
    changeAvatar: {
        color: colors.primary,
        marginTop: 10,
        textAlign: "center",
        fontSize: 16,
    },
    profileContent: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        color: colors.primary,
        fontSize: 16,
        marginTop: 10,
        marginLeft: 8,
    },
    inputs: {
        width: "80%",
    },
});