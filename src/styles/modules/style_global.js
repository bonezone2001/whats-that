// Colours and styles used globally throughout the app without particular context.

import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#FF6B6B',
    primaryDark: '#300000',
    secondary: '#57CC99',
    secondaryDark: '#003300',

    danger: '#E16468',
    success: '#57CC99',
    warning: '#FF7F50',
    info: '#AAA',

    background: '#171717',
    buttonBackground: '#AAA',
    modalBackground: '#101010',

    inputBackground: '#101010',
    inputBorder: '#666',
    inputBorderFocus: '#AAA',
    inputPlaceholder: '#666',
    inputLabelActive: '#AAA',

    text: '#EEE',

    tabIconDefault: '#868686',
    tabIconSelected: '#52C443',
    tabBar: '#242424',

    meBubble: '#C8A48C',
    otherBubble: '#372D2B',
    draftBubble: '#AAA',
    meText: '#000',
    otherText: '#FFF',
    draftText: '#FFF',
    meTimestamp: '#101010',
    otherTimestamp: '#EFEFEF',
    holdMenuBackground: '#372D2B',
    holdMenuText: '#FFF',
};

colors.tabIconSelected = colors.secondary;

export const globalStyle = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
        color: colors.text,
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    contentContainer: {
        width: '100%',
        marginTop: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        marginRight: 20,
    },
    transparent: {
        backgroundColor: 'transparent',
    },
    infoText: {
        color: '#555',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },
    sheetButton: {
        marginTop: 10,
        justifyContent: 'flex-start',
        paddingHorizontal: 40,
    },
});
