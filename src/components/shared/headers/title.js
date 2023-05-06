// Header title component.

import { globalStyle } from '@styles';
import { Text } from 'react-native';
import propTypes from 'prop-types';
import { t } from '@locales';
import React from 'react';

export function HeaderTitle({ title }) {
    return (
        <Text
            numberOfLines={1}
            style={globalStyle.headerTitle}
            accessibilityLabel={`${t('current_screen')}: ${title}`}
        >
            {title}
        </Text>
    );
}

HeaderTitle.propTypes = {
    title: propTypes.string.isRequired,
};
