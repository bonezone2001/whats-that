import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Dimensions } from 'react-native';
import { useStore } from '@store';
import { colors } from '@styles';

import * as SettingsSheet from './settings_sheet';
import * as ChatSheet from './chat_sheet';

const sheets = [SettingsSheet, ChatSheet];

export default function AppBottomSheet() {
    const [activeSheet, setActiveSheet] = useState(SettingsSheet);
    const [activeRoute, setActiveRoute] = useState(null);
    const navigation = useNavigation();
    const sheetRef = useRef(null);
    const store = useStore();

    // Snap points are dynamically set based on the active sheet and height of the screen
    const snapPoints = useMemo(() => {
        const { height } = Dimensions.get('window');
        let percent = activeSheet?.settings?.sheetPercent;
        if (typeof percent === 'function') percent = percent(activeRoute);
        return [Math.round((height * (percent || 18)) / 100)];
    }, [activeSheet, activeRoute]);

    // Hold reference to the bottom sheet in the store
    useEffect(() => {
        store.setBottomSheet(sheetRef);
        store.bottomSheet = sheetRef;
    }, [sheetRef, activeSheet]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            if (!e.data.state) return;
            sheetRef.current?.close();

            const { state } = e.data;
            const parentRoute = state.routes[state.index];
            let currentRoute = parentRoute;

            // Recursively find the deepest (active) route
            while (currentRoute.state) {
                currentRoute = currentRoute.state.routes[currentRoute.state.index];
            }

            // Set the active route and set sheet according to that route
            setActiveRoute(currentRoute);
            const curSheet = sheets.find((sheet) => {
                const { parentRouteName, currentRouteName } = sheet.settings;
                return (!parentRouteName || parentRouteName === parentRoute.name)
                  && (!currentRouteName || currentRouteName === currentRoute.name);
            });
            if (curSheet) setActiveSheet(curSheet);
        });
        return unsubscribe;
    }, [navigation, store.bottomSheet]);

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={snapPoints}
            backgroundComponent={customBackground}
            enablePanDownToClose
        >
            <Animated.View style={{ flex: 1 }}>
                {
                    activeSheet
                        ? <activeSheet.sheet route={activeRoute} />
                        : null
                }
            </Animated.View>
        </BottomSheet>
    );
}

const customBackground = ({ style }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: colors.modalBackground,
        borderRadius: 20,
        borderWidth: 1,
    }));
    const containerStyle = useMemo(
        () => [style, containerAnimatedStyle],
        [style, containerAnimatedStyle],
    );

    return <Animated.View pointerEvents="none" style={containerStyle} />;
};
