// Bottoms tabs that are only available when the user is logged in.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileStack from '@navigator/stack/stack_profile';
import ContactStack from '@navigator/stack/stack_contact';
import ChatStack from '@navigator/stack/stack_chat';
import { tabBarOptions } from '@styles';
import { t } from '@locales';
import React from 'react';

const AuthorizedTab = createBottomTabNavigator();

export default function BottomBarNav() {
    const tabs = [
        ['Chat', t('chat'), ChatStack],
        ['Contacts', t('contacts'), ContactStack],
        ['Profile', t('profile'), ProfileStack],
    ];
    return (
        <AuthorizedTab.Navigator screenOptions={tabBarOptions} initialRouteName="Chat">
            {
                tabs.map(([name, label, component]) => (
                    <AuthorizedTab.Screen
                        key={name}
                        name={name}
                        component={component}
                        options={{
                            tabBarAccessibilityLabel: label,
                            tabBarTestID: `${name.toLowerCase()}-tab`,
                        }}
                    />
                ))
            }
        </AuthorizedTab.Navigator>
    );
}
