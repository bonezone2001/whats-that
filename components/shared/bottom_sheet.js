// Note: the bottom sheet is a bit buggy on web so to fix that we only have one for the entire app and the content and snap points are changed dynamically
// For now, its only for logout and settings

import React, { useEffect, useMemo, useRef } from 'react';
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
import { entryUtils } from '@utils';

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
    const snapPoints = useMemo(() => [Math.round((Dimensions.get('window').height * 18) / 100) || "15%"], []);
    const bottomSheetRef = useRef(null);
    const navigation = useNavigation();
    const store = useStore();

    useEffect(() => {
        store.setBottomSheet(bottomSheetRef);
    }, [bottomSheetRef]);

    const handleLogout = async () => {
        try {
            await entryUtils.logout();
        } catch (error) {
            console.log(error);
        }
    };

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