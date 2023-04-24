import { StyleSheet } from "react-native";

// Export all styles variables (eg. colors, fonts, etc.)
export const colors = {
    primary: "#FF6B6B",
    primaryDark: "#300000",
    secondary: "#57CC99",
    secondaryDark: "#003300",
  
    danger: "#e16468",
    success: "#57CC99",
    warning: "#FF7F50",
    info: "#aaa",
  
    background: "#171717",
    buttonBackground: "#aaa",
    inputBackground: '#aaa',
    modalBackground: '#101010',
  
    inputPlaceholder: '#666',
    text: "#fff",

    tabIconDefault: '#868686',
    tabIconSelected: '#52c443',
    tabBar: '#242424',
};

colors.tabIconSelected = colors.secondary;

export const globalStyle = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
        color: colors.text,
        overflow: "hidden",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    contentContainer: {
        width: "100%",
        marginTop: 5,
    },
    transparent: {
        backgroundColor: "transparent",
    },
    errorText: {
        color: "#555",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 10,
    },
});