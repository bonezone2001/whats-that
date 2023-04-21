import { globalStyle, entryStyle, colors } from "@styles";
import { Text, View } from "react-native";

export default ({ navigation }) => {
    return (
        <View style={[globalStyle.container]}>
            <Text style={[entryStyle.title, { color: colors.primary }]}>FRIENDS!</Text>
        </View>
    );
}