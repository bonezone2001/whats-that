import Avatar from '@components/shared/avatar';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './global_style';

export const screenOptions = {
    headerShown: false,
    animation: "fade_from_bottom",
};

export const tabBarOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Profile')
            return <Avatar size={30} style={{ opacity: focused ? 1 : 0.5 }} />;
        else if (route.name === 'Chat')
            iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
        else if (route.name === 'Friends')
            iconName = focused ? 'people' : 'people-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarLabel: () => null,
    tabBarActiveTintColor: colors.tabIconSelected,
    tabBarInactiveTintColor: colors.tabIconDefault,
    tabBarStyle: {
        paddingHorizontal: 5,
        backgroundColor: colors.tabBar,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    headerShown: false,
});