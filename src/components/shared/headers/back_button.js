// Back button used in the header of a screen.
// Default behaviour is back to previous screen but can be overridden with href or onPress.

import { useNavigation } from '@react-navigation/native';
import Button from '@components/shared/button';
import PropTypes from 'prop-types';
import { t } from '@locales';
import React from 'react';

export function BackButton({ href, onPress }) {
    const navigation = useNavigation();

    return (
        <Button
            mode="text"
            icon="chevron-left"
            prefixSize={38}
            href={href}
            accessibilityLabel={t('go_back')}
            accessibilityHint={t('go_back_hint')}
            onPress={onPress || navigation.goBack}
        />
    );
}

BackButton.propTypes = {
    href: PropTypes.string,
    onPress: PropTypes.func,
};

BackButton.defaultProps = {
    href: null,
    onPress: null,
};
