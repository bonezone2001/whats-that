import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import Button from "@components/shared/button";
import { Feather } from "@expo/vector-icons";
import { globalStyle } from "@styles";
import { useEffect } from "react";
import { useStore } from "@store";

export default () => {
    const navigation = useNavigation();
    const store = useStore();
    
    return (
        <View style={globalStyle.container}>
        </View>
    );
}