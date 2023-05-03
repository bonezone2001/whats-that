import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileView from '@components/views/profile/profile_view';
import ProfileEdit from '@components/views/profile/profile_edit';
import { headerOptions } from '@styles';
import React from 'react';

const ProfileStack = createNativeStackNavigator();

export default function ProfileNav() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerBackVisible: false }} initialRouteName="View">
            <ProfileStack.Screen name="View" component={ProfileView} options={headerOptions} />
            <ProfileStack.Screen name="Edit" component={ProfileEdit} options={headerOptions} />
        </ProfileStack.Navigator>
    );
}
