import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfileStack from '@navigator/stack/profile_stack';
import ContactStack from '@navigator/stack/contact_stack';
import ChatStack from '@navigator/stack/chat_stack';
import { tabBarOptions } from '@styles';

const AuthorizedTab = createBottomTabNavigator();

export default () => (
    <AuthorizedTab.Navigator screenOptions={tabBarOptions} initialRouteName="Chat">
        <AuthorizedTab.Screen name="Chat" component={ChatStack} />
        <AuthorizedTab.Screen name="Contacts" component={ContactStack} />
        <AuthorizedTab.Screen name="Profile" component={ProfileStack} />
    </AuthorizedTab.Navigator>
);