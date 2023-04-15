import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './components/screens/home';
import LoginScreen from './components/screens/login';
import RegisterScreen from './components/screens/register';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator options
const stackOptions = {
  headerShown: false
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login" screenOptions={stackOptions}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
