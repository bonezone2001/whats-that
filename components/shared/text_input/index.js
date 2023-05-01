// Chunky but extensive text input component.
// Although it being chunky makes it harder to read.
// -- Kyle Pelham

import {
    View,
    TextInput as RNTextInput,
    ActivityIndicator,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    Platform,
    Animated,
} from 'react-native';
import React, {
    useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import { colors } from '@styles';
import { appUtils } from '@utils';
import PropTypes from 'prop-types';
import { staticStyles } from './static_style';

// Its at times like these I wish I could use TypeScript
export default function TextInput({
    shape,
    mode,
    label,
    placeholder,
    multiline,
    contentType,
    value,
    editable,
    loading,
    block,
    icon,
    iconLibrary,
    prefixColor,
    prefixSize,
    color,
    placeholderTextColor,
    forceValidation,
    validation,
    onValidation,
    onFocus,
    onBlur,
    prefixStyle,
    inputStyle,
    labelStyle,
    style,
    ...props
}) {
    const inputRef = useRef(null);
    const [error, setError] = useState('');
    const [focused, setFocused] = useState(false);
    const IconLibrary = appUtils.getIconLibrary(iconLibrary);

    // Label animation
    const labelShouldFloatTo = value.length > 0 || focused;
    const labelShouldFloat = useRef(new Animated.Value(value?.length > 0 ? 1 : 0)).current;
    useEffect(() => {
        Animated.timing(labelShouldFloat, {
            toValue: labelShouldFloatTo ? 1 : 0,
            duration: 200,
            useNativeDriver: false, // Doesn't support paddingLeft, otherwise it'd be on
        }).start();
    }, [labelShouldFloatTo, labelShouldFloat]);

    const focusInput = () => inputRef.current?.focus();

    // Copy focus state to parent
    useEffect(() => {
        setFocused(inputRef.current?.isFocused());
    }, [inputRef.current]);

    useEffect(() => {
        if (forceValidation) performValidation();
    }, [forceValidation]);

    // Resize input for multiline
    useEffect(() => {
        if (multiline) {
            const el = inputRef.current;
            if (Platform.OS !== 'web' || !el) return;
            el.style.height = 0;
            const newHeight = el.offsetHeight - el.clientHeight + el.scrollHeight;
            el.style.height = `${newHeight}px`;
        }
    }, [value]);

    // Filter out style props that are reserved for the label, prefix and input
    const getContainerStyleProp = useCallback(() => {
        const toExtract = ['height', 'fontSize', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginVertical', 'marginHorizontal'];
        const styleProp = {};
        Object.keys(style).forEach((key) => {
            if (!toExtract.includes(key)) {
                styleProp[key] = style[key];
            }
        });
        return styleProp;
    }, [style]);

    const performValidation = () => {
        if (!validation) return;
        const errorMsg = validation(value);
        setError(errorMsg);
    };

    const animateLabel = useMemo(() => ({
        transform: [{
            translateY: labelShouldFloat.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
            }),
        },
        {
            scale: labelShouldFloat.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.8],
            }),
        }],
        paddingLeft: labelShouldFloat.interpolate({
            inputRange: [0, 1],
            outputRange: [
                (
                    styles?.inputContainer?.paddingLeft
                    || styles?.inputContainer?.paddingHorizontal
                    || 15
                )
                    + (icon ? prefixSize + 10 : 0),
                0,
            ],
        }),
    }), [labelShouldFloat, icon, prefixSize]);

    const styles = useMemo(() => StyleSheet.create({
        ...staticStyles,
        container: {
            ...staticStyles.container,
            width: block > 0 ? `${block}%` : undefined,
            ...appUtils.getEntriesWithPrefix(style, 'margin'),
        },
        inputContainer: {
            ...staticStyles.inputContainer,
            borderColor: labelShouldFloatTo ? colors.inputBorderFocus : colors.inputBorder,
            backgroundColor: mode === 'dense' ? colors.inputBackground : 'transparent',
            borderBottomWidth: mode === 'flat' ? 1 : undefined,
            borderWidth: mode === 'outlined' ? 1 : 0,
            borderRadius: shape === 'rounded' ? 8 : shape === 'circle' ? 100 : 0,
            paddingVertical: 10,
            paddingHorizontal: 15,
            ...getContainerStyleProp(),
        },
        input: {
            ...staticStyles.input,
            maxHeight: 100,
            fontSize: style.fontSize || 16,
            color,
            ...inputStyle,
        },
        label: {
            ...staticStyles.label,
            color: labelShouldFloatTo ? colors.inputLabelActive : placeholderTextColor,
            fontSize: style.fontSize || 16,
            paddingTop: style?.paddingTop || style?.paddingVertical || 10,
            paddingLeft: (
                style?.paddingLeft
                || style?.paddingHorizontal
                || 15
            ) + (icon ? prefixSize + 10 : 0),
            ...labelStyle,
        },
        error: {
            ...staticStyles.error,
            color: colors.danger,
            marginTop: 5,
        },
    }), [
        block,
        color,
        getContainerStyleProp,
        icon,
        inputStyle,
        labelShouldFloatTo,
        mode,
        placeholderTextColor,
        prefixSize,
        shape,
        style,
        labelStyle,
        colors,
    ]);

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onFocus={focusInput} onPress={focusInput}>
                <Animated.View style={styles.inputContainer}>
                    {label.length > 0 && (!loading || labelShouldFloatTo) ? (
                        <Animated.Text
                            style={[styles.label, labelStyle, animateLabel]}
                        >
                            {label}
                        </Animated.Text>
                    ) : null}
                    <View style={styles.input}>
                        {loading ? (
                            <ActivityIndicator
                                style={[styles.prefix, prefixStyle]}
                                size={prefixSize}
                                color={prefixColor}
                            />
                        ) : icon && (
                            <IconLibrary
                                style={[styles.prefix, prefixStyle]}
                                name={icon}
                                size={prefixSize}
                                color={prefixColor}
                            />
                        )}
                        <RNTextInput
                            ref={inputRef}
                            placeholder={label ? '' : placeholder}
                            multiline={multiline}
                            keyboardType={contentType}
                            value={value}
                            editable={editable}
                            onFocus={() => {
                                setFocused(true);
                                onFocus();
                            }}
                            onBlur={() => {
                                setFocused(false);
                                performValidation();
                                onBlur();
                            }}
                            style={[styles.input, inputStyle]}
                            placeholderTextColor={placeholderTextColor}
                            {...props}
                        />
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
            {error.length > 0 ? (
                <Text style={styles.error}>{error}</Text>
            ) : null}
        </View>
    );
}

TextInput.propTypes = {
    shape: PropTypes.oneOf(['box', 'rounded', 'circle']),
    mode: PropTypes.oneOf(['dense', 'outlined', 'flat']),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    multiline: PropTypes.bool,
    contentType: PropTypes.oneOf([
        'default',
        'email-address',
        'numeric',
        'phone-pad',
        'number-pad',
        'decimal-pad',
        'visible-password',
    ]),
    value: PropTypes.string,
    editable: PropTypes.bool,
    loading: PropTypes.bool,
    block: PropTypes.number,
    icon: PropTypes.string,
    iconLibrary: PropTypes.string,
    prefixColor: PropTypes.string,
    prefixSize: PropTypes.number,
    color: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    forceValidation: PropTypes.bool,
    validation: PropTypes.func,
    onValidation: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    prefixStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    inputStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    labelStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
};

TextInput.defaultProps = {
    shape: 'box',
    mode: 'flat',
    label: '',
    placeholder: '',
    multiline: false,
    contentType: 'default',
    value: '',
    editable: true,
    loading: false,
    block: 0,
    icon: null,
    iconLibrary: 'feather',
    prefixColor: colors.text,
    prefixSize: 16,
    color: colors.text,
    placeholderTextColor: colors.inputPlaceholder,
    forceValidation: false,
    validation: () => '',
    onValidation: () => {},
    onFocus: () => {},
    onBlur: () => {},
    prefixStyle: {},
    inputStyle: {},
    labelStyle: {},
    style: {},
};
