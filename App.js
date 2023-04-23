import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AuthorizedTabs from '@navigator/bottom/authorized_bottom_tab';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useCallback, useState } from 'react';
import AuthStack from '@navigator/stack/auth_stack';
import * as SplashScreen from 'expo-splash-screen';
import { appUtils, entryUtils } from '@utils';
import { StatusBar } from 'expo-status-bar';
import { globalStyle } from '@styles';
import { useFonts } from 'expo-font';
import { useStore } from '@store';

SplashScreen.preventAutoHideAsync();
appUtils.fixReanimated();

export default function App() {
    const [loading, setLoading] = useState(true);
    const store = useStore();

    // Android doesn't like variable fonts, so we have to use static fonts
    const [fontLoaded] = useFonts({
        'Montserrat_Regular': require('@assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        'Montserrat_Bold': require('@assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    });

    useEffect(() => {
        (async () => {
            if (await entryUtils.loadOrPurgeDeadToken())
                await entryUtils.loadUserData();
            await appUtils.loadIcons();
            setLoading(false);
        })();
    }, [store.token]);

    // Display splash screen until app is ready
    const onLayoutRootView = useCallback(async () => fontLoaded && !loading && await SplashScreen.hideAsync(), [fontLoaded, loading]);
    if (loading || !fontLoaded) return null;

    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <SafeAreaView style={globalStyle.root} onLayout={onLayoutRootView}>
                <NavigationContainer style={globalStyle.root}>
                    {store.token ? (<AuthorizedTabs />) : (<AuthStack />)}
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}