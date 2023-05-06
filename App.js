import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthorizedTabs from '@navigator/bottom/bottom_authorized';
import { NavigationContainer } from '@react-navigation/native';
import { useLoadLocale } from '@hooks/modules/useLoadLocale';
import BottomSheet from '@components/shared/bottom_sheet';
import { MenuProvider } from 'react-native-popup-menu';
import { useLoadFonts, useLoadApiData } from '@hooks';
import AuthStack from '@navigator/stack/stack_auth';
import * as SplashScreen from 'expo-splash-screen';
import { globalStyle, toastConfig } from '@styles';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { appUtils } from '@utils';
import { useStore } from '@store';

SplashScreen.preventAutoHideAsync();
appUtils.disableContextMenu();
appUtils.fixReanimated();

export default function App() {
    const { isFontLoaded } = useLoadFonts();
    const { isDataLoaded } = useLoadApiData();
    const { isLocaleLoaded } = useLoadLocale();
    const store = useStore();

    // Display splash screen until app is ready
    const onLayoutRootView = useCallback(
        async () => isFontLoaded && isDataLoaded && isLocaleLoaded && SplashScreen.hideAsync(),
        [isFontLoaded, isDataLoaded, isLocaleLoaded],
    );
    if (!isDataLoaded || !isFontLoaded || !isLocaleLoaded) return null;

    return (
        <SafeAreaProvider>
            <StatusBar />
            <GestureHandlerRootView style={globalStyle.root}>
                <MenuProvider>
                    <SafeAreaView
                        style={[globalStyle.root]}
                        edges={['right', 'bottom', 'left']}
                        onLayout={onLayoutRootView}
                    >
                        <NavigationContainer style={globalStyle.root}>
                            {store.token ? <AuthorizedTabs /> : <AuthStack />}
                            <BottomSheet />
                            <Toast config={toastConfig} />
                        </NavigationContainer>
                    </SafeAreaView>
                </MenuProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
