// Displays an image in the typical styles associated with an avatar.

import {
    Dimensions,
    Modal,
    StyleSheet,
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '@components/shared/button';
import { profileStyle } from '@styles';
import React, { useState } from 'react';
import { Camera } from 'expo-camera';
import PropTypes from 'prop-types';
import { t } from '@locales';

export default function AvatarSelector({
    onShouldClose,
    onSelect,
    visible,
}) {
    const [cameraMode, setCameraMode] = useState(-1);
    const [cameraRef, setCameraRef] = useState(null);

    const takePhoto = async () => {
        if (cameraRef) {
            const result = await cameraRef.takePictureAsync({
                base64: true,
                quality: 1,
                exif: false,
            });
            onSelect(
                result.base64.startsWith('data:')
                    ? result.base64
                    : `data:image/png;base64,${result.base64}`,
            );
            setCameraMode(-1);
            onShouldClose(false);
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

        if (!result.canceled) {
            onSelect(`data:image/png;base64,${result.assets[0].base64}`);
        }
        onShouldClose(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={() => {
                onShouldClose();
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
                                    onPress={() => {
                                        setCameraMode(Camera.Constants.Type.back);
                                    }}
                                    style={profileStyle.modalButton}
                                >
                                    {t('components.avatar_selector.take_photo')}
                                </Button>
                                <Button
                                    mode="text"
                                    onPress={selectFromLibrary}
                                    style={profileStyle.modalButton}
                                >
                                    {t('components.avatar_selector.choose_from_library')}
                                </Button>
                                <Button
                                    mode="text"
                                    onPress={onShouldClose}
                                    style={profileStyle.modalButton}
                                >
                                    {t('cancel')}
                                </Button>
                            </View>
                        )
                        : (
                            <Camera
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
                                        {t('cancel')}
                                    </Button>
                                    <Button
                                        mode="text"
                                        onPress={() => {
                                            setCameraMode(
                                                cameraMode === Camera.Constants.Type.back
                                                    ? Camera.Constants.Type.front
                                                    : Camera.Constants.Type.back,
                                            );
                                        }}
                                        style={profileStyle.cameraButton}
                                    >
                                        {t('components.avatar_selector.flip')}
                                    </Button>
                                    <Button
                                        mode="text"
                                        onPress={takePhoto}
                                        style={profileStyle.cameraButton}
                                    >
                                        {t('components.avatar_selector.take_photo')}
                                    </Button>
                                </View>
                            </Camera>
                        )
                }
            </View>
        </Modal>
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

AvatarSelector.propTypes = {
    visible: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onShouldClose: PropTypes.func.isRequired,
};
