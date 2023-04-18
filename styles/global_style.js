import { StyleSheet } from "react-native";

// Export all styles variables (eg. colors, fonts, etc.)
export const colors = {
    primary: "#FF6B6B",
    primaryDark: "#300000",
    secondary: "#57CC99",
    secondaryDark: "#003300",
  
    warning: "#FF7F50",
    danger: "#e16468",
    success: "#00FF00",
    info: "#0000FF",
  
    background: "#171717",
    buttonBackground: "#aaa",
    inputBackground: '#aaa',
    modalBackground: '#000000',
  
    inputPlaceholder: '#666',
    text: "#fff",
  };

  export const globalStyle = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
        color: colors.text,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
});