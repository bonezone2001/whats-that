import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '@components/views/auth/auth_register';
import Login from '@components/views/auth/auth_login';
import { screenOptions } from '@styles';
import React from 'react';

const AuthStack = createNativeStackNavigator();

export default function AuthNav() {
    return (
        <AuthStack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Register" component={Register} />
        </AuthStack.Navigator>
    );
}
