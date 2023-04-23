import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfileStack from '@navigator/stack/profile_stack';
import Friends from '@components/views/friends';
import Chat from '@components/views/chat';
import { tabBarOptions } from '@styles';

const AuthorizedTab = createBottomTabNavigator();

export default () => (
    <AuthorizedTab.Navigator screenOptions={tabBarOptions}>
        <AuthorizedTab.Screen name="Chat" component={Chat} />
        <AuthorizedTab.Screen name="Friends" component={Friends} />
        <AuthorizedTab.Screen name="Profile" component={ProfileStack} />
    </AuthorizedTab.Navigator>
);