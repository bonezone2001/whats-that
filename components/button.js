import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@styles";
import React from "react";

// Properties:
// - onClick: function - called when the button is pressed
// - size: small, medium, large - Size of the button
// - shape: rounded, circle - Shape of the button
// - loading: boolean - Set to true to show a loading indicator
// - icon: string - Icon to show on the button
// - href: string - Navigate to a screen when the button is pressed
// - disabled: boolean - Set to true to disable the button
// - type: primary, secondary - Type of button (color)
// - ghost: boolean - Set to true to make the button transparent with a border
// - block: number - Set to a number between 0 and 100 to make the button fill the screens width by that percentage
// - children: string - What to show on the button


export default ({
  onClick,
  size = "medium",
  shape,
  loading = false,
  icon,
  href,
  disabled = false,
  type,
  ghost = false,
  block = 0,
  children,
}) => {
  // Handle click and navigation
  const navigation = useNavigation();
  function onPress() {
    if (href) return navigation.navigate(href);
    onClick();
  }

  // What should we show on the button?
  // If loading, show a loading indicator, otherwise show a combination of the icon and the children (text) or just the children
  function renderChildren() {
    let child = children;
    if (loading) return <ActivityIndicator color="#FFF" />;
    if (typeof children === "string")
      child = <Text style={styles.text}>{children}</Text>;
    if (icon)
      child = (
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
          {child}
        </View>
      );
    return child;
  }

  // Switches all the different button styles and combines them
  function getButtonStyles() {
    const style = {
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
      ...style.base,
      style["size"][size],
      style["shape"][shape],
      style["type"][type],
      style["block"],
      style["ghost"],
      style["disabled"],
    ];
  }

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
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
