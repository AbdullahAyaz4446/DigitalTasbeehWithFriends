import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './src/Screens/StartScreen';
import LoginScreen from './src/Screens/LoginScreen';
import SignupScreen from './src/Screens/SignupScreen';
import HomeScreen from './src/Screens/HomeScreen';
import AllTasbeehScreen from './src/Screens/Alltasbeeh';
import CreateTasbeeh from './src/Screens/CreateTasbeeh';
import Creategroup from './src/Screens/Creategroup';
import CreateGroupsSingles from './src/Screens/CreateGroupsSingles';
import AssignTasbeeh from './src/Screens/AssignTasbeeh';
import Maunnallycontribution from './src/Screens/Maunnallycontribution';

const Stack = createNativeStackNavigator();

const App = () => {
  var ipadd = '192.168.100.224';
  global.url = `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/user/`;
  global.tasbeehurl = `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/CreateTasbeeh/`;
  // global.Imageurl = `http://${ipadd}/DigitalTasbeehWithFriendsApi/Images/`;
  global.Group= `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/Group/`;
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Alltasbeeh" component={AllTasbeehScreen} />
        <Stack.Screen name="CraeteTasbeeh" component={CreateTasbeeh} />
        <Stack.Screen name="Creategroup" component={Creategroup} />
        <Stack.Screen name="CreateGroupSingle" component={CreateGroupsSingles} />
        <Stack.Screen name="AssignTasbeeh" component={AssignTasbeeh} />
        <Stack.Screen name="Maunnallycontribution" component={Maunnallycontribution} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 

export default App;
