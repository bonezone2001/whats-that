import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileView from '@components/views/profile_view';
import ProfileEdit from '@components/views/profile_edit';
import { colors, screenOptions } from '@styles';

const ProfileStack = createNativeStackNavigator();

export default ({ navigation }) => {
    const nScreenOptions = {
        headerTitle: () => null,
        ...screenOptions,
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
            backgroundColor: colors.background,
            borderBottomColor: 'transparent',
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
        },
    };

    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="View" component={ProfileView} options={nScreenOptions} />
            <ProfileStack.Screen name="Edit" component={ProfileEdit} options={nScreenOptions} />
        </ProfileStack.Navigator>
    );
}