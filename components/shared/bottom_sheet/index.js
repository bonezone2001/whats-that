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

export default function AppBottomSheet() {
    const [activeSheet, setActiveSheet] = useState(SettingsSheet);
    const [activeRoute, setActiveRoute] = useState(null);
    const navigation = useNavigation();
    const sheetRef = useRef(null);
    const store = useStore();

    const sheets = [SettingsSheet, ChatSheet];
    const snapPoints = useMemo(() => {
        const percent = activeSheet?.settings?.sheetPercent;
        if (typeof percent === 'function') {
            return [Math.round((Dimensions.get('window').height * percent(activeRoute)) / 100)];
        }
        return [Math.round((Dimensions.get('window').height * (percent || 18)) / 100)];
    }, [activeSheet, activeRoute]);

    useEffect(() => {
        store.setBottomSheet(sheetRef);
        store.bottomSheet = sheetRef;
    }, [sheetRef, activeSheet]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            sheetRef.current?.close();

            if (!e.data.state) return;
            const { state } = e.data;
            const parentRoute = state.routes[state.index];
            let currentRoute = parentRoute;
            while (currentRoute.state) {
                currentRoute = currentRoute.state.routes[currentRoute.state.index];
            }

            setActiveRoute(currentRoute);
            for (let i = 0; i < sheets.length; i++) {
                const sheet = sheets[i];
                if (sheet.settings.parentRouteName
                    && sheet.settings.parentRouteName !== parentRoute.name) continue;
                if (sheet.settings.currentRouteName
                    && sheet.settings.currentRouteName !== currentRoute.name) continue;
                setActiveSheet(sheet);
                break;
            }
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
