// Header title component.

import { globalStyle } from '@styles';
import { Text } from 'react-native';
import propTypes from 'prop-types';
import React from 'react';

export function HeaderTitle({ title }) {
    return <Text numberOfLines={1} style={globalStyle.headerTitle}>{title}</Text>;
}

HeaderTitle.propTypes = {
    title: propTypes.string.isRequired,
};
