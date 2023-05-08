// Theme and styles related to toast messages.

import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Text, View } from 'react-native';
import { colors } from './style_global';
import React from 'react';

export const toastStyles = {
    info: {
        width: '95%',
        backgroundColor: colors.modalBackground,
        borderLeftColor: colors.secondary,
        borderLeftWidth: 5,
    },
    success: {
        width: '95%',
        backgroundColor: colors.modalBackground,
        borderColor: colors.success,
        borderWidth: 1,
        borderLeftWidth: 5,
    },
    error: {
        width: '95%',
        backgroundColor: colors.danger,
        borderColor: colors.modalBackground,
        borderWidth: 2,
        borderLeftWidth: 5,
    },

    text1Style: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text,
    },
    text2Style: {
        fontSize: 15,
        color: colors.text,
    },
};

export const toastConfig = {
    info: (props) => (
        <BaseToast
            {...props}
            style={toastStyles.info}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={toastStyles.text1Style}
            text2Style={toastStyles.text2Style}
        />
    ),

    success: (props) => (
        <BaseToast
            {...props}
            style={toastStyles.success}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={toastStyles.text1Style}
            text2Style={toastStyles.text2Style}
        />
    ),

    error: (props) => (
        <ErrorToast
            {...props}
            style={toastStyles.error}
            text1Style={toastStyles.text1Style}
            text2Style={toastStyles.text2Style}
        />
    ),

    tomatoToast: ({ text1, props }) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
            <Text>{text1}</Text>
            <Text>{props.uuid}</Text>
        </View>
    ),
};
