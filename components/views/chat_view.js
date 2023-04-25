import { useNavigation } from "@react-navigation/native";
import Button from "@components/shared/button";
import { View, Text } from "react-native";
import { globalStyle } from "@styles";
import { useEffect } from "react";

export default () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => navigation.navigate("Create")}
                    style={globalStyle.transparent}
                    size="small"
                    icon="plus"
                    iconLibrary="Feather"
                    iconSize={30}
                    textColor="#fff"
                />
            ),
            headerTitle: () => (
                <Text style={globalStyle.headerTitle}>Chats</Text>
            ),
        });
    }, []);

    return (
        <View style={globalStyle.container}>
            <Text>CHAT!</Text>
        </View>
    );
}