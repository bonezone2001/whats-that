import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileStack from '@navigator/stack/stack_profile';
import ContactStack from '@navigator/stack/stack_contact';
import ChatStack from '@navigator/stack/stack_chat';
import { tabBarOptions } from '@styles';
import React from 'react';

const AuthorizedTab = createBottomTabNavigator();

export default function BottomBarNav() {
    return (
        <AuthorizedTab.Navigator screenOptions={tabBarOptions} initialRouteName="Chat">
            <AuthorizedTab.Screen name="Chat" component={ChatStack} />
            <AuthorizedTab.Screen name="Contacts" component={ContactStack} />
            <AuthorizedTab.Screen name="Profile" component={ProfileStack} />
        </AuthorizedTab.Navigator>
    );
}
