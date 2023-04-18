import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { globalStyle } from '@styles';
import { useFonts } from 'expo-font';
import { View } from 'react-native';

import Login from '@navigator/stack/login';
import Register from '@navigator/stack/register';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
    headerShown: false,
    animation: "fade_from_bottom",
};

export default function App() {
const [authToken, setAuthToken] = useState("");

// Android doesn't like variable fonts, so we have to use static fonts
const [fontLoaded] = useFonts({
    'Montserrat_Regular': require('@assets/fonts/Montserrat/Montserrat-Regular.ttf'),
    'Montserrat_Bold': require('@assets/fonts/Montserrat/Montserrat-Bold.ttf'),
});

const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) await SplashScreen.hideAsync();
}, [fontLoaded]);

if (!fontLoaded)
    return null;

return (
    <View style={globalStyle.root} onLayout={onLayoutRootView}>
        <NavigationContainer style={globalStyle.root}>
            {authToken ? (
                <Tab.Navigator screenOptions={screenOptions}>
                </Tab.Navigator>
            ) : (
                <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                </Stack.Navigator>
            )}
            <StatusBar style="auto" />
        </NavigationContainer>
    </View>
);
}

{/* <StatusBar style="auto" /> */}