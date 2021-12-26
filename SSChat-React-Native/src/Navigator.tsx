
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import Home from './components/Home';
import ChatScreen from './screens/chat/ChatScreen';
import UsersList from './components/UsersList';
import { ContactsScreen } from './components/ContactsScreen';

const Stack = createStackNavigator();

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="ContactsScreen" component={ContactsScreen} />

                <Stack.Screen name="UsersList" component={UsersList} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default Navigator;
