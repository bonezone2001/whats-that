import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileView from '@components/views/profile_view';
import ProfileEdit from '@components/views/profile_edit';
import { headerOptions } from '@styles';

const ProfileStack = createNativeStackNavigator();

export default ({ navigation }) => {
    return (
        <ProfileStack.Navigator screenOptions={{headerBackVisible: false}}>
            <ProfileStack.Screen name="View" component={ProfileView} options={headerOptions} />
            <ProfileStack.Screen name="Edit" component={ProfileEdit} options={headerOptions} />
        </ProfileStack.Navigator>
    );
}