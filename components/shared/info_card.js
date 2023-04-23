import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@styles';

export default ({
    icon,
    label,
    value,
    type,
    iconSize = 25,
    ghost = false,
    textColor = "#000",
    iconColor = null,
    block,
    shape,
    style
}) => {
    const getCardStyle = () => {
        const bStyle = {
            base: [styles.card],
            shape: {
                rounded: styles.rounded,
            },
            type: {
                primary: styles.primary,
                secondary: styles.secondary,
            },
            block: block > 0 ? { width: `${block}%` } : null,
            ghost: ghost ? styles.ghost : null,
        };

        return [
            ...bStyle.base,
            bStyle["shape"][shape],
            bStyle["type"][type],
            bStyle["block"],
            bStyle["ghost"],
            style,
        ];
    }

    return (
        <View style={getCardStyle()}>
            {icon ? (
                <View style={styles.icon}>
                    <Ionicons name={icon} size={iconSize} color={iconColor || textColor} />
                </View>
            ) : null}
            <View style={styles.content}>
                <Text style={[styles.label, { color: textColor }]}>{label}</Text>
                <Text style={[styles.value, { color: textColor }]}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 5,
        marginHorizontal: 20,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: "#aaa",
    },
    rounded: {
        borderRadius: 10,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    ghost: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    content: {
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
    },
});