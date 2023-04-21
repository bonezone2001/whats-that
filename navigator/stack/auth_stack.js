import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '@components/views/auth/register';
import Login from '@components/views/auth/login';
import { screenOptions } from '@styles';

const AuthStack = createNativeStackNavigator();

export default () => (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
);