// Chunky but extensive button component.
// Although it being chunky makes it harder to read.

import {
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { appUtils } from '@utils';
import { colors } from '@styles';

// Its at times like these I wish I could use TypeScript
export default function Button({
    shape,
    mode,
    loading,
    icon,
    href,
    iconLibrary,
    textColor,
    buttonColor,
    prefixColor,
    prefixSize,
    block,
    disabled,
    onPress,
    prefixStyle,
    textStyle,
    style,
    children,
    ...props
}) {
    const IconLibrary = appUtils.getIconLibrary(iconLibrary);
    const navigation = useNavigation();

    // Extract fontSize before passing style to useMemo
    const { fontSize, color, ...containerStyle } = style;
    // eslint-disable-next-line no-param-reassign
    if (!prefixColor) prefixColor = color || textColor;

    const styles = useMemo(
        () => StyleSheet.create({
            ...staticStyles,
            buttonContainer: {
                ...staticStyles.buttonContainer,
                borderColor: colors.inputBorder,
                borderWidth: mode === 'outlined' ? 1 : 0,
                borderRadius: shape === 'rounded' ? 8 : shape === 'circle' ? 100 : 0,
                backgroundColor: mode === 'contained' ? buttonColor : 'transparent',
                width: block > 0 ? `${block}%` : null,
                opacity: disabled ? 0.5 : 1,
                ...containerStyle,
            },
            buttonText: {
                ...staticStyles.buttonText,
                color: color || textColor,
                marginLeft: icon ? 8 : 0,
                fontSize: fontSize || 16,
                ...textStyle,
            },
            icon: {
                marginRight: children ? 8 : 0,
            },
        }),
        [block, buttonColor, children, disabled, icon, mode, shape, style, textColor, textStyle],
    );

    const internalOnPress = () => {
        if (href) navigation.navigate(href);
        else onPress();
    };

    return (
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={internalOnPress}
            accessibilityRole="button"
            accessible
            disabled={disabled}
            accessibilityState={{ disabled: false }}
            {...props}
        >
            {loading
                ? (
                    <ActivityIndicator
                        style={prefixStyle}
                        color={prefixColor}
                        size={prefixSize}
                    />
                )
                : (
                    <>
                        {icon
                        && (
                            <IconLibrary
                                style={[styles.icon, prefixStyle]}
                                name={icon}
                                size={prefixSize}
                                color={prefixColor}
                            />
                        )}
                        {children && (
                            typeof children === 'string'
                                ? <Text style={styles.buttonText}>{children}</Text>
                                : children
                        )}
                    </>
                )}
        </TouchableOpacity>
    );
}

const staticStyles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

Button.propTypes = {
    shape: PropTypes.oneOf(['box', 'rounded', 'circle']),
    mode: PropTypes.oneOf(['contained', 'outlined', 'text']),
    loading: PropTypes.bool,
    icon: PropTypes.string,
    href: PropTypes.string,
    iconLibrary: PropTypes.string,
    textColor: PropTypes.string,
    buttonColor: PropTypes.string,
    prefixColor: PropTypes.string,
    prefixSize: PropTypes.number,
    block: PropTypes.number,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    prefixStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    textStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    children: PropTypes.node,
};

Button.defaultProps = {
    shape: 'box',
    mode: 'contained',
    loading: false,
    icon: null,
    href: null,
    iconLibrary: 'feather',
    textColor: colors.text,
    buttonColor: colors.primary,
    prefixColor: '',
    prefixSize: 16,
    block: 0,
    disabled: false,
    onPress: () => {},
    prefixStyle: {},
    textStyle: {},
    style: {},
    children: null,
};
