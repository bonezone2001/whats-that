// Card for displaying general information.
// Can include an icon and some text.

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { colors } from '@styles';
import React from 'react';

export default function InfoCard({
    icon,
    label,
    value,
    iconSize,
    textColor,
    iconColor,
    block,
    style,
}) {
    const styles = StyleSheet.create({
        ...staticStyles,
        card: {
            ...staticStyles.card,
            borderRadius: block ? 10 : 0,
            width: block ? `${block}%` : 'auto',
            borderColor: iconColor || textColor,
            borderWidth: iconColor ? 1 : 0,
            ...style,
        },
        label: {
            ...staticStyles.label,
            color: textColor,
        },
        value: {
            ...staticStyles.value,
            color: textColor,
        },
    });

    return (
        <View style={styles.card} accessible accessibilityRole="text">
            {icon && (
                <View style={styles.icon} accessible>
                    <Ionicons name={icon} size={iconSize} color={iconColor || textColor} />
                </View>
            )}
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

const staticStyles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: colors.primary,
        marginVertical: 5,
        marginHorizontal: 20,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#aaa',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
    },
});

InfoCard.propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    iconSize: PropTypes.number,
    textColor: PropTypes.string,
    iconColor: PropTypes.string,
    block: PropTypes.number,
    style: PropTypes.object,
};

InfoCard.defaultProps = {
    icon: null,
    iconSize: 24,
    textColor: colors.text,
    iconColor: null,
    block: 0,
    style: {},
};
