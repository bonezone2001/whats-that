import { StyleSheet } from 'react-native';
import { colors, globalStyle } from './style_global';

export const entryStyle = StyleSheet.create({
    container: {
        ...globalStyle.container,
        backgroundColor: 'transparent',
    },
    title: {
        fontFamily: 'Montserrat_Regular',
        fontSize: 50,
        color: colors.primary,
        marginBottom: 30,
    },
    touchableText: {
        fontWeight: 'bold',
        color: '#555',
        marginTop: 20,
        marginBottom: 20,
    },
    touchableTextBold: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#f6f6f6',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
        backgroundColor: colors.background,
    },
});
