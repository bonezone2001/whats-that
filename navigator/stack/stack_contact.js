/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactBlock from '@components/views/contact/contact_blocked';
import ContactView from '@components/views/contact/contact_view';
import ContactAdd from '@components/views/contact/contact_add';
import { headerOptions, globalStyle } from '@styles';
import Button from '@components/shared/button';
import { apiUtils, appUtils } from '@utils';
import PropTypes from 'prop-types';

import { Text, View } from 'react-native';
import React, { useEffect } from 'react';

const ContactStack = createNativeStackNavigator();

export default function ContactNav({ navigation }) {
    const viewHeaderOptions = {
        ...headerOptions,
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                <Button
                    mode="text"
                    icon="x-circle"
                    prefixSize={28}
                    href="Blocked"
                />
                <Button
                    mode="text"
                    icon="user-plus"
                    prefixSize={28}
                    href="Add"
                />
            </View>
        ),
        headerTitle: () => (
            <Text numberOfLines={1} style={globalStyle.headerTitle}>Contacts</Text>
        ),
    };

    // Debounce is needed because the listener is called multiple times when the stack is changed
    useEffect(() => {
        const updateFunc = appUtils.debounceLeading(apiUtils.updateContactsAndBlocked, 100);
        navigation.addListener('state', () => {
            if (navigation.getState().index === 1) updateFunc();
        });
    }, []);

    return (
        <ContactStack.Navigator screenOptions={{ headerBackVisible: false }}>
            <ContactStack.Screen name="View" component={ContactView} options={viewHeaderOptions} />
            <ContactStack.Screen name="Blocked" component={ContactBlock} options={headerOptions} />
            <ContactStack.Screen name="Add" component={ContactAdd} options={headerOptions} />
        </ContactStack.Navigator>
    );
}

ContactNav.propTypes = {
    navigation: PropTypes.object.isRequired,
};
