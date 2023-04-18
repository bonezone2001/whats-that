import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "@styles";
import React from "react";

// Properties:
// - onClick: function - called when the button is pressed
// - size: small, medium, large - Size of the button
// - shape: rounded, circle - Shape of the button
// - loading: boolean - Set to true to show a loading indicator
// - icon: string - Icon to show on the button
// - href: string - Navigate to a screen when the button is pressed
// - textColor: string - Color of the text
// - disabled: boolean - Set to true to disable the button
// - type: primary, secondary - Type of button (color)
// - ghost: boolean - Set to true to make the button transparent with a border
// - block: number - Set to a number between 0 and 100 to make the button fill the screens width by that percentage
// - children: string - What to show on the button

export default ({
    onPress,
    size = "medium",
    shape,
    loading = false,
    icon,
    href,
    textColor = null,
    disabled = false,
    type,
    ghost = false,
    block = 0,
    children,
    style,
}) => {
    // Handle click and navigation
    const navigation = useNavigation();
    function onClick() {
        if (href) return navigation.navigate(href);
        if (onPress) onPress();
    }

    // What should we show on the button?
    // If loading, show a loading indicator, otherwise show a combination of the icon and the children (text) or just the children
    function renderChildren() {
        let child = children;
        if (loading) return <ActivityIndicator color={textColor || colors.text} />;
        if (typeof children === "string") {
            style = { };
            if (textColor) style.color = textColor;
            child = <Text style={[styles.text, style]}>{children}</Text>;
        }
        if (icon)
            child = (
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={20} color={textColor || colors.text} />
                    {child}
                </View>
            );
        return child;
    }

    // Switches all the different button styles and combines them
    function getButtonStyles() {
        const bStyle = {
            base: [styles.button],
            size: {
                small: styles.small,
                medium: styles.medium,
                large: styles.large,
            },
            shape: {
                rounded: styles.rounded,
                circle: styles.circle,
            },
            type: {
                primary: styles.primary,
                secondary: styles.secondary,
            },
            block: block > 0 ? { width: `${block}%` } : null,
            ghost: ghost ? styles.ghost : null,
            disabled: disabled && styles.disabled,
        };

        return [
            ...bStyle.base,
            bStyle["size"][size],
            bStyle["shape"][shape],
            bStyle["type"][type],
            bStyle["block"],
            bStyle["ghost"],
            bStyle["disabled"],
            style,
        ];
    }

    return (
        <TouchableOpacity
            style={getButtonStyles()}
            onPress={onClick}
            activeOpacity={0.7}
            disabled={disabled || loading}
        >
            {renderChildren()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#fff",
        backgroundColor: "#aaa",
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    rounded: {
        borderRadius: 10,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 100,
        padding: 0,
    },
    primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    icon: {
        marginRight: 5,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
