import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './src/Screens/StartScreen';
import LoginScreen from './src/Screens/LoginScreen';
import  SignupScreen from './src/Screens/SignupScreen';
import HomeScreen from './src/Screens/HomeScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer >
      <Stack.Navigator 
        initialRouteName="Start"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="SignUp" component={SignupScreen} /> 
        <Stack.Screen name="Hoe" component={HomeScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
