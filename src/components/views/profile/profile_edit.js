// View profile screen.
// Show user their details and allow navigation to edit profile.

import AvatarSelector from '@components/shared/avatar_selector';
import { useNavigation } from '@react-navigation/native';
import { CheckLoad } from '@components/shared/headers';
import { View, Text, ScrollView } from 'react-native';
import TextInput from '@components/shared/text_input';
import { profileStyle, globalStyle } from '@styles';
import Avatar from '@components/shared/avatar';
import Toast from 'react-native-toast-message';
import Button from '@components/shared/button';
import React, { useState } from 'react';
import { useScreenHeader } from '@hooks';
import { entryUtils } from '@utils';
import { useStore } from '@store';
import api from '@api';

export default function ProfileEditScreen() {
    const navigation = useNavigation();
    const store = useStore();

    const [firstName, setFirstName] = useState(store.user.first_name);
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);
    const [lastName, setLastName] = useState(store.user.last_name);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(store.user.avatar);
    const [email, setEmail] = useState(store.user.email);
    const [updating, setUpdating] = useState(false);
    const [password, setPassword] = useState('');

    const performValidation = () => entryUtils
        .validateUpdateDetails(firstName, lastName, email, password, confirmPassword);

    const submitChanges = async () => {
        const errors = performValidation();
        if (errors) return;

        setUpdating(true);
        try {
            if (avatar !== store.user.avatar) {
                await api.uploadUserPhoto(store.userId, avatar);
            }
            await api.updateUserInfo(store.userId, {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
            });
            store.setUser({
                ...store.user,
                first_name: firstName,
                last_name: lastName,
                email,
                avatar,
            });

            navigation.navigate('View');
        } catch (error) {
            if (error?.response?.data) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.response.data.message,
                });
            }
        } finally {
            setUpdating(false);
        }
    };

    useScreenHeader({
        title: 'Edit Profile',
        right: (
            <CheckLoad
                onPress={submitChanges}
                loading={updating}
                disabled={performValidation() !== null}
            />
        ),
        args: [firstName, lastName, email, avatar, updating, password, confirmPassword],
    });

    return (
        <View style={globalStyle.container}>
            <ScrollView style={globalStyle.contentContainer}>
                <View style={{ alignItems: 'center' }}>
                    <Button
                        mode="text"
                        style={profileStyle.avatarButton}
                        onPress={() => setShowAvatarSelect(true)}
                    >
                        <Avatar
                            source={{ uri: avatar }}
                            style={profileStyle.avatar}
                            size={150}
                        />
                    </Button>
                    <Text style={profileStyle.avatarSubtext}>Edit Avatar</Text>
                </View>
                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <TextInput
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        style={profileStyle.formElement}
                        validation={() => entryUtils.validateName(firstName)}
                        block={90}
                    />
                    <TextInput
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        style={profileStyle.formElement}
                        validation={() => entryUtils.validateName(firstName)}
                        block={90}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={profileStyle.formElement}
                        validation={() => entryUtils.validateEmail(email)}
                        block={90}
                    />
                    <TextInput
                        label="New Password"
                        value={password}
                        onChangeText={setPassword}
                        style={profileStyle.formElement}
                        validation={() => entryUtils.validatePassword(password)}
                        secureTextEntry
                        block={90}
                    />
                    <TextInput
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={profileStyle.formElement}
                        validation={() => entryUtils
                            .validateConfirmPassword(password, confirmPassword)}
                        secureTextEntry
                        block={90}
                    />
                </View>

                <AvatarSelector
                    visible={showAvatarSelect}
                    onSelect={setAvatar}
                    onShouldClose={() => setShowAvatarSelect(false)}
                />
            </ScrollView>
        </View>
    );
}
