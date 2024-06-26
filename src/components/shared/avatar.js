// Displays an image in the typical styles associated with an avatar.

import { StyleSheet, Image } from 'react-native';
import { colors } from '@styles/modules/style_global';
import PropTypes from 'prop-types';
import React from 'react';

export default function Avatar({
    source,
    size,
    style,
    shape,
    ...props
}) {
    const styles = StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: shape === 'circle' ? size : shape === 'rounded' ? 10 : 0,
            backgroundColor: colors.background,
            overflow: 'hidden',
        },
    });

    return (
        <Image
            source={source}
            style={[styles.container, style]}
            {...props}
        />
    );
}

Avatar.propTypes = {
    source: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
    ]).isRequired,
    size: PropTypes.number,
    shape: PropTypes.oneOf(['box', 'rounded', 'circle']),
    style: PropTypes.object,
};

Avatar.defaultProps = {
    size: 50,
    shape: 'circle',
    style: {},
};
