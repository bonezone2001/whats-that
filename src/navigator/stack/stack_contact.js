// Stack of screens when user has contact tab selected.

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactBlock from '@components/views/contact/contact_blocked';
import ContactView from '@components/views/contact/contact_view';
import ContactAdd from '@components/views/contact/contact_add';
import { apiUtils, appUtils } from '@utils';
import React, { useEffect } from 'react';
import { headerOptions } from '@styles';
import PropTypes from 'prop-types';

const ContactStack = createNativeStackNavigator();

export default function ContactNav({ navigation }) {
    // Debounce is needed because the listener is called multiple times when the stack is changed
    useEffect(() => {
        const updateFunc = appUtils.debounceLeading(apiUtils.updateContactsAndBlocked, 100);
        navigation.addListener('state', () => {
            if (navigation.getState().index === 1) updateFunc();
        });
    }, []);

    return (
        <ContactStack.Navigator screenOptions={{ headerBackVisible: false }}>
            <ContactStack.Screen name="View" component={ContactView} options={headerOptions} />
            <ContactStack.Screen name="Blocked" component={ContactBlock} options={headerOptions} />
            <ContactStack.Screen name="Add" component={ContactAdd} options={headerOptions} />
        </ContactStack.Navigator>
    );
}

ContactNav.propTypes = {
    navigation: PropTypes.object.isRequired,
};
