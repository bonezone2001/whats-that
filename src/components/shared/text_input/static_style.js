// This is the static style for the text input component.
// Moved here since component is quite large.

import { Platform } from 'react-native';
import { colors } from '@styles';

export const staticStyles = {
    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 5,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    input: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            },
        }),
    },
    label: {
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: 16,
        userSelect: 'none',
    },
    prefix: {
        marginRight: 8,
    },
    error: {
        fontSize: 12,
        color: colors.error,
    },
};
