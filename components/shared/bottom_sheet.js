// Note: the bottom sheet is a bit buggy on web so to fix that we only have one for the entire app and the content and snap points are changed dynamically
// For now, its only for logout and settings

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useStore } from "@store";
import Animated, {
    useAnimatedStyle,
    interpolateColor,
} from "react-native-reanimated";
import { colors } from '@styles';
import Button from './button';
import { useNavigation } from '@react-navigation/native';
import { apiUtils, entryUtils } from '@utils';
import api from '@api';

const customBackground = ({
    style,
    animatedIndex,
}) => {
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: colors.modalBackground,
        borderRadius: 20,
        borderWidth: 1,
    }));
    const containerStyle = useMemo(
        () => [style, containerAnimatedStyle],
        [style, containerAnimatedStyle]
    );

    return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default () => {
    const [currentRoute, setCurrentRoute] = useState(null);
    const [sheetSize, setSheetSize] = useState(18);
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();
    const store = useStore();

    const snapPoints = useMemo(() => [Math.round((Dimensions.get('window').height * sheetSize) / 100) || "15%"], [sheetSize]);

    useEffect(() => {
        store.setBottomSheet(bottomSheetRef);
    }, [bottomSheetRef]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            if (!e.data.state) return;
            const state = e.data.state;
            let currentRoute = state.routes[state.index];
            while (currentRoute.state) currentRoute = currentRoute.state.routes[currentRoute.state.index];
            setCurrentRoute(currentRoute);

            if (currentRoute.name === "Profile")
                setSheetSize(18);
            else if (currentRoute.name === "ViewChat") {
                const params = currentRoute.params;
                if (params?.chat?.creator?.user_id === store?.user?.user_id)
                    setSheetSize(18);
                else
                    setSheetSize(15);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const handleLogout = async () => {
        try {
            await entryUtils.logout();
        } catch (error) {
            console.log(error);
        }
    };

    const handleModifyChat = async () => {
        navigation.navigate("Modify", {
            chat: currentRoute.params.chat
        });
    };

    const handleLeaveChat = async () => {
        try {
            const chat = currentRoute.params.chat;
            await api.removeUserFromChat(chat.chat_id, store.user.user_id);
            apiUtils.updateChats();
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };

    const renderProfileElements = () => {
        return (
            <>
                <Button
                    onPress={handleLogout}
                    shape="rounded"
                    size="small"
                    textColor="white"
                    textAlign="left"
                    icon="settings"
                    style={styles.button}
                >
                    Settings
                </Button>
                <Button
                    onPress={handleLogout}
                    shape="rounded"
                    size="small"
                    textColor="white"
                    textAlign="left"
                    icon="log-out"
                    style={[styles.button, { marginTop: 10 }]}
                >
                    Logout
                </Button>
            </>
        )
    }

    const renderChatElements = () => {
        return (
            <>
                {currentRoute?.params?.chat?.creator?.user_id === store?.user?.user_id && (
                <>
                <Button
                    onPress={handleModifyChat}
                    shape="rounded"
                    size="small"
                    textColor="white"
                    textAlign="left"
                    iconLibrary='feather'
                    icon="edit"
                    style={[styles.button]}
                >
                    Modify Chat
                </Button>
                </>
                )}
                <Button
                    onPress={handleLeaveChat}
                    shape="rounded"
                    size="small"
                    textColor="white"
                    textAlign="left"
                    icon="log-out"
                    style={[styles.button, { marginTop: 10 }]}
                >
                    Leave Chat
                </Button>
            </>
        )
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            store.bottomSheet?.current?.close();
        });
        return unsubscribe;
    }, [navigation, store.bottomSheet]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            backgroundComponent={customBackground}
        >
            <View style={styles.contentContainer}>
                {
                    currentRoute?.name === "Profile" ? renderProfileElements() : renderChatElements()
                }
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    button: {
        backgroundColor: "transparent",
    },
});