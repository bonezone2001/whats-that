import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatIndividual from '@components/views/chat_individual';
import ChatCreate from '@components/views/chat_create';
import ChatModify from '@components/views/chat_modify';
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
        headerLeft: () => null,
    };

    return (
        <ChatStack.Navigator screenOptions={{headerBackVisible: false}}>
            <ChatStack.Screen name="View" component={ChatView} options={viewHeaderOptions} />
            <ChatStack.Screen name="Create" component={ChatCreate} options={viewHeaderOptions} />
            <ChatStack.Screen name="ViewChat" component={ChatIndividual} options={viewHeaderOptions} />
            <ChatStack.Screen name="Modify" component={ChatModify} options={viewHeaderOptions} />
        </ChatStack.Navigator>
    );
}