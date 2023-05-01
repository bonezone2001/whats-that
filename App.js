import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthorizedTabs from '@navigator/bottom/authorized_bottom_tab';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useCallback, useState } from 'react';
import BottomSheet from '@components/shared/bottom_sheet';
import { apiUtils, appUtils, entryUtils } from '@utils';
import { MenuProvider } from 'react-native-popup-menu';
import AuthStack from '@navigator/stack/auth_stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { globalStyle } from '@styles';
import { useFonts } from 'expo-font';
import { useStore } from '@store';

SplashScreen.preventAutoHideAsync();
appUtils.disableContextMenu();
appUtils.fixReanimated();

export default function App() {
    const [loading, setLoading] = useState(true);
    const store = useStore();

    // Android doesn't like variable fonts, so we have to use static fonts
    const [fontLoaded] = useFonts({
        Montserrat_Regular: require('@assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        Montserrat_Bold: require('@assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    });

    useEffect(() => {
        (async () => {
            if (await entryUtils.loadOrPurgeDeadToken()) {
                await entryUtils.loadUserData();

                // This endpoint breaks if the user has no chats, will eventually timesout
                apiUtils.updateChats();
                apiUtils.updateContactsAndBlocked();
            }
            await appUtils.loadIcons();
            setLoading(false);
        })();
    }, [store.token]);

    // Display splash screen until app is ready
    const onLayoutRootView = useCallback(
        async () => fontLoaded && !loading && SplashScreen.hideAsync(),
        [fontLoaded, loading],
    );
    if (loading || !fontLoaded) return null;

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
                        </NavigationContainer>
                    </SafeAreaView>
                </MenuProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
