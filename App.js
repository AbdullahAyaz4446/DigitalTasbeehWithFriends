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
import AllgrouosSingle from './src/Screens/AllgrouosSingle';
import CreateGroupsSingles from './src/Screens/CreateGroupsSingles';
import AssignTasbeeh from './src/Screens/AssignTasbeeh';
import Maunnallycontribution from './src/Screens/Maunnallycontribution';
import TasbeehGroup from './src/Screens/TasbeehGroup';
import Friends from './src/Screens/Friends';
import Craetewazifa from './src/Screens/Craetewazifa';
import Singletasbeeh from './src/Screens/Singletasbeeh';
import Deatilesgrouptasbeeh from './src/Screens/Deatilesgrouptasbeeh';

const Stack = createNativeStackNavigator();
const App = () => {
  var ipadd = '192.168.100.225';
  global.url = `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/user/`;
  global.tasbeehurl = `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/CreateTasbeeh/`;
  // global.Imageurl = `http://${ipadd}/DigitalTasbeehWithFriendsApi/Images/`;
  global.Group= `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/Group/`;
  global.AssignTasbeh= `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/AssignTasbeeh/`;
  global.SendRequest= `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/Request/`;
  global.Singletasbeeh= `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/Sigle/`;
  global.Wazifa= `http://${ipadd}/DigitalTasbeehWithFriendsApi/api/Wazifa/`;
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
        <Stack.Screen name="AllgrouosSingle" component={AllgrouosSingle} />
        <Stack.Screen name="CreateGroupSingle" component={CreateGroupsSingles} />
        <Stack.Screen name="AssignTasbeeh" component={AssignTasbeeh} />
        <Stack.Screen name="Maunnallycontribution" component={Maunnallycontribution} />
        <Stack.Screen name="TasbeehGroup" component={TasbeehGroup} />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen name="Wazifa" component={Craetewazifa} />
        <Stack.Screen name="Singletasbeeh" component={Singletasbeeh}/>
        <Stack.Screen name="Deatilesgrouptasbeeh" component={Deatilesgrouptasbeeh}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
} 

export default App;
