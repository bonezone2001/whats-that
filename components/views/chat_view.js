import { useNavigation } from "@react-navigation/native";
import Button from "@components/shared/button";
import { View, Text } from "react-native";
import { globalStyle } from "@styles";
import { useEffect } from "react";

export default () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate("View")}
                    style={globalStyle.transparent}
                    size="small"
                    icon="x"
                    iconLibrary="Feather"
                    iconSize={40}
                    textColor="#fff"
                />
            ),
        });
    }, []);

    return (
        <View style={globalStyle.container}>
            <Text>CHAT!</Text>
        </View>
    );
}