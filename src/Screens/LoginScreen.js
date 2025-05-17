import { StyleSheet, View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../utiles/colors';


const LoginScreen = () => {



  
  {/*Varaiables*/ }
  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');








  {/*LogIn Api Function*/ }
  const Login = async () => {
    try {
      console.log("pressed");
      console.log(ipadd);
      const query = `Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const responce = await fetch(url + query);
      if (responce.ok) {
        console.log("Hello");
        var Userid = await responce.json();
        console.log(Userid);
        navigation.navigate('Home', {
          "Userdata": Userid,
          userId: Userid.ID
        });

      } else {
        const ans = await responce.text();
        console.log(ans);
      }
    } catch (error) {
      console.log(error.message);
    }
  }







  {/*Move Screen Sign Up Function */ }
  const handleSignup = () => {
    console.log('Button Pressed!');
    navigation.navigate('SignUp');
  };







 {/*Main View */ }
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
      </TouchableOpacity> */}

      <View style={styles.textcontainer}>
        <Text style={styles.headingtext}>Hey,</Text>
        <Text style={styles.headingtext}>Welcome</Text>
        <Text style={styles.headingtext}>Back</Text>
      </View>

      <View style={styles.textcontainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Enter your email"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setemail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.textcontainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Enter your Password"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          keyboardType="default"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={Login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  textcontainer: {
    marginVertical: 10,
  },
  headingtext: {
    fontSize: 45,
    color: 'black',
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 10,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 100,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 50,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
});