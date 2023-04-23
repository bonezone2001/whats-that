// Avatar component (circle with image inside)
import {
    StyleSheet,
    Image,
} from "react-native";

import defaultAvatar from '@assets/images/default_avatar.jpg';
import { colors } from "@styles/global_style";
import React from "react";

// Properties:
// - source: object - Image source
// - size: number - Size of the avatar
// - style: object - Style to apply to avatar image conmponent
// - onPress: function - Called when is pressed
// - shape: circle, square, rounded - Shape of the avatar

export default ({
    source,
    size = 50,
    style,
    shape = "circle", // circle, square, rounded
}) => {
    const styles = StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: shape === "circle" ? size : shape === "rounded" ? 10 : 0,
            backgroundColor: colors.background,
            overflow: "hidden",
        },
    });

    return (
        <Image
            source={source ? source : defaultAvatar}
            style={[styles.container, style]}
        />
    );
};