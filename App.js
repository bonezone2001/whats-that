import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { globalStyle, colors } from '@styles';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { useStore } from './store';
import api from './api';

import Login from '@navigator/stack/login';
import Register from '@navigator/stack/register';
import Chat from '@navigator/bottom/chat';
import Friends from '@navigator/bottom/friends';
import Profile from '@navigator/bottom/profile';

import Avatar from '@components/shared/avatar';
import defaultAvatar from '@assets/images/default_avatar.jpg';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const store = useStore();

    // Android doesn't like variable fonts, so we have to use static fonts
    const [fontLoaded] = useFonts({
        'Montserrat_Regular': require('@assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        'Montserrat_Bold': require('@assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    });

    const getAvatar = () => {
        if (avatar) return avatar;
        return defaultAvatar;
    };

    const screenOptions = {
        headerShown: false,
        animation: "fade_from_bottom",
    };
    
    const tabBarOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Profile')
                return <Avatar size={30} source={getAvatar()} style={{ opacity: focused ? 1 : 0.5 }} />;
            else if (route.name === 'Chat')
                iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
            else if (route.name === 'Friends')
                iconName = focused ? 'people' : 'people-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: () => null,
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
            paddingHorizontal: 5,
            backgroundColor: colors.tabBar,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        headerShown: false,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontLoaded && !loading) await SplashScreen.hideAsync();
    }, [fontLoaded, loading]);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("token");
            const userId = await AsyncStorage.getItem("userId");
            
            if (token) {
                try {
                    const abc = await api.testAuth(token);
                    console.log(abc);
                    store.setUserId(userId);
                    store.setToken(token);
                } catch (error) {
                    if (error?.response?.status === 401) {
                        await AsyncStorage.removeItem("token");
                        await AsyncStorage.removeItem("userId");
                        store.setToken(null);
                    }
                } finally {
                    setLoading(false);
                }
            } else
                setLoading(false);
        })();
    }, []);

    if (loading || !fontLoaded)
        return null;

    return (
        <View style={globalStyle.root} onLayout={onLayoutRootView}>
            <NavigationContainer style={globalStyle.root}>
                {store.token ? (
                    <Tab.Navigator screenOptions={tabBarOptions}>
                        <Tab.Screen name="Chat" component={Chat} />
                        <Tab.Screen name="Friends" component={Friends} />
                        <Tab.Screen name="Profile" component={Profile} />
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