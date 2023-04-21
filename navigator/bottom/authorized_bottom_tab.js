import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Profile from '@components/views/profile';
import Friends from '@components/views/friends';
import Chat from '@components/views/chat';
import { tabBarOptions } from '@styles';

const AuthorizedTab = createBottomTabNavigator();

export default () => (
    <AuthorizedTab.Navigator screenOptions={tabBarOptions}>
        <AuthorizedTab.Screen name="Chat" component={Chat} />
        <AuthorizedTab.Screen name="Friends" component={Friends} />
        <AuthorizedTab.Screen name="Profile" component={Profile} />
    </AuthorizedTab.Navigator>
);