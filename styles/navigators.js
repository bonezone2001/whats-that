import Avatar from '@components/shared/avatar';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@store';

import React from 'react';
import { colors } from './global_style';

export const screenOptions = {
    headerShown: false,
    animation: 'fade_from_bottom',
};

export const headerOptions = {
    headerTitle: () => null,
    ...screenOptions,
    headerShown: true,
    headerShadowVisible: false,
    headerStyle: {
        backgroundColor: colors.background,
        borderBottomColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
};

// TODO: Move this to authorized_bottom_tab.js
export const tabBarOptions = ({ route }) => {
    const store = useStore();
    return {
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Profile') {
                return (
                    <Avatar
                        size={30}
                        style={{
                            opacity: focused ? 1 : 0.5,
                            borderWidth: 1,
                            borderColor: 'grey',
                        }}
                        source={{ uri: store?.user?.avatar }}
                    />
                );
            }
            if (route.name === 'Chat') iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
            else if (route.name === 'Contacts') iconName = focused ? 'people' : 'people-outline';
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
    };
};
