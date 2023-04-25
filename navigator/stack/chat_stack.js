import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatView from '@components/views/chat_view';
import { headerOptions } from '@styles';
import { View } from 'react-native';

const ChatStack = createNativeStackNavigator();

export default ({ navigation }) => {
    
    const viewHeaderOptions = {
        ...headerOptions,
        headerRight: () => (
            <View style={{ flexDirection: "row" }}>
            </View>
        ),
    };

    return (
        <ChatStack.Navigator screenOptions={{headerBackVisible: false}}>
            <ChatStack.Screen name="View" component={ChatView} options={viewHeaderOptions} />
        </ChatStack.Navigator>
    );
}