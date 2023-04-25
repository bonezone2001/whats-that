import Button from '@components/shared/button';
import { View, Text } from "react-native";
import { globalStyle } from "@styles";
import { useEffect } from "react";

// Show individual chat, can be passed a chat id
export default ({ route, navigation }) => {
    const { chat } = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => navigation.navigate("View")}
                    style={globalStyle.transparent}
                    size="small"
                    icon="chevron-left"
                    iconLibrary="Feather"
                    iconSize={40}
                    textColor="#fff"
                />
            ),
            headerTitle: () => (
                <Text numberOfLines={1} style={globalStyle.headerTitle}>{chat.name}</Text>
            ),
        });
    }, []);

    return (
        <View style={globalStyle.container}>
            <Text>Chat Individual</Text>
            <Text>{chat.name}</Text>
            <Text>{chat.chat_id}</Text>
            <Text>{chat.creator.first_name}</Text>
        </View>
    );
}