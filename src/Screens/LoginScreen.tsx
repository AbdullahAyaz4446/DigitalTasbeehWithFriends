import { StyleSheet, View, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../utiles/colors';  

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const handleHome = () => {
    navigation.navigate('Home'); 
  };

  const handleSignup = () => {
    console.log('Button Pressed!'); 
    navigation.navigate('SignUp'); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-sharp" size={width * 0.1} color="#000" />
      </TouchableOpacity>
      
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
      
      <TouchableOpacity style={styles.button} onPress={handleHome}>
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
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  textcontainer: {
    marginVertical: height * 0.015,
  },
  headingtext: {
    fontSize: width * 0.1,
    color: 'black',
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    paddingLeft: width * 0.025,
  },
  input: {
    height: height * 0.06,
    borderColor: '#000',
    borderWidth: 1,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.5,
  },
  button: {         
    backgroundColor: colors.primary, 
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.08,
    marginTop: height * 0.05,
  },
  buttonText: {
    color: colors.white, 
    fontWeight: 'bold',
    fontSize: width * 0.06,
    textAlign: 'center',
  },
});
