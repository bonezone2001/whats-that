// View profile screen.
// Show user their details and allow navigation to edit profile.

import {
    View,
    Text,
    ScrollView,
    Modal,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { profileStyle, colors, globalStyle } from '@styles';
import { useNavigation } from '@react-navigation/native';
import TextInput from '@components/shared/text_input';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Avatar from '@components/shared/avatar';
import Button from '@components/shared/button';
import * as Camera from 'expo-camera';
import { entryUtils } from '@utils';
import { useStore } from '@store';
import api from '@api';
import { BackButton, CheckLoad, HeaderTitle } from '@components/shared/headers';

export default function ProfileEditScreen() {
    const navigation = useNavigation();
    const store = useStore();

    const [firstName, setFirstName] = useState(store.user.first_name);
    const [lastName, setLastName] = useState(store.user.last_name);
    const [modalVisible, setModalVisible] = useState(false);
    const [avatar, setAvatar] = useState(store.user.avatar);
    const [email, setEmail] = useState(store.user.email);
    const [cameraMode, setCameraMode] = useState(-1);
    const [cameraRef, setCameraRef] = useState(null);
    const [majorError, setMajorError] = useState('');
    const [updating, setUpdating] = useState(false);

    const submitChanges = async () => {
        setMajorError('');
        const errors = entryUtils.validateUpdateDetails(firstName, lastName, email);
        if (errors) {
            setMajorError('Please provide valid details!');
            return;
        }

        setUpdating(true);
        try {
            if (avatar !== store.user.avatar) {
                await api.uploadUserPhoto(store.userId, avatar);
            }
            await api.updateUserInfo(store.userId, {
                first_name: firstName,
                last_name: lastName,
                email,
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
                setMajorError(error.response.data);
            }
        } finally {
            setUpdating(false);
        }
    };

    const takePhoto = async () => {
        if (cameraRef) {
            const result = await cameraRef.takePictureAsync({
                base64: true,
                quality: 1,
                exif: false,
            });
            // Add data:image/png;base64, prefix to base64 string IF its not already there
            setAvatar(
                result.base64.startsWith('data:')
                    ? result.base64
                    : `data:image/png;base64,${result.base64}`
            );
            setCameraMode(-1);
            setModalVisible(false);
        }
    };

    const selectFromLibrary = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
            exif: false,
        });

        if (!result.cancelled) {
            setAvatar(`data:image/png;base64,${result.assets[0].base64}`);
        }
        setModalVisible(false);
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <BackButton href="View" />,
            headerRight: () => <CheckLoad onPress={submitChanges} loading={updating} />,
            headerTitle: () => <HeaderTitle title="Edit Profile" />,
        });
    }, [firstName, lastName, email, avatar, updating]);

    return (
        <View style={globalStyle.container}>
            <ScrollView style={globalStyle.contentContainer}>
                <View style={{ alignItems: 'center' }}>
                    <Button
                        mode="text"
                        style={profileStyle.avatarButton}
                        onPress={() => setModalVisible(true)}
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
                        block={90}
                    />
                    <TextInput
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        style={profileStyle.formElement}
                        block={90}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={profileStyle.formElement}
                        block={90}
                    />
                    {
                        majorError
                            ? <Text style={globalStyle.infoText}>{majorError}</Text>
                            : null
                    }
                </View>

                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                    collapsable
                >
                    <View style={[profileStyle.modalView, { backgroundColor: cameraMode === -1 ? 'rgba(0,0,0,0.5)' : 'black' }]}>
                        {
                            cameraMode === -1
                                ? (
                                    <View style={profileStyle.modalButtonContainer}>
                                        <Button
                                            mode="text"
                                            onPress={() => setCameraMode(Camera.Camera.Constants.Type.back)}
                                            style={profileStyle.modalButton}
                                        >
                                            Take Photo
                                        </Button>
                                        <Button
                                            mode="text"
                                            onPress={selectFromLibrary}
                                            style={profileStyle.modalButton}
                                        >
                                            Choose from Library
                                        </Button>
                                        <Button
                                            mode="text"
                                            onPress={() => {
                                                setModalVisible(!modalVisible);
                                            }}
                                            style={profileStyle.modalButton}
                                        >
                                            Cancel
                                        </Button>
                                    </View>
                                )
                                : (
                                    <Camera.Camera
                                        // Take up full width of screen, then set height to match width to make 1:1 ratio
                                        style={[styles.camera, { height: Dimensions.get('window').width }]}
                                        type={cameraMode}
                                        ratio="1:1"
                                        ref={(ref) => setCameraRef(ref)}
                                    >
                                        <View style={styles.cameraButtonContainer}>
                                            <Button
                                                mode="text"
                                                onPress={() => setCameraMode(-1)}
                                                style={profileStyle.cameraButton}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                mode="text"
                                                onPress={() => setCameraMode(cameraMode === Camera.Camera.Constants.Type.back ? Camera.Camera.Constants.Type.front : Camera.Camera.Constants.Type.back)}
                                                style={profileStyle.cameraButton}
                                            >
                                                Flip
                                            </Button>
                                            <Button
                                                mode="text"
                                                onPress={takePhoto}
                                                style={profileStyle.cameraButton}
                                            >
                                                Take Photo
                                            </Button>
                                        </View>
                                    </Camera.Camera>
                                )
                        }
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    cameraButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 40,
    },
});
