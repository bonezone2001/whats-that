// Avatar component (circle with image inside)
import {
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { colors } from "@styles/global_style";

export default ({
    source,
    size = 50,
    style,
    onPress,
}) => {
    const styles = StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: 100,
            backgroundColor: colors.background,
            overflow: "hidden",
        },
    });

    return (
        <Image
            source={source}
            style={[styles.container, style]}
        />
    );
};