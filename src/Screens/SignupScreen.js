import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../utiles/colors'; 

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setphone] = useState('');
  const [name, setname] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.textcontainer}>
        <Text style={styles.headingtext}>Let's get</Text>
        <Text style={styles.headingtext}>Started</Text>
      </View>

      <View style={styles.inputcontainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Enter your username"
          placeholderTextColor="#A9A9A9"
          value={name}
          onChangeText={setname}
        />
      </View>

      <View style={styles.inputcontainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Enter your Phone Number"
          placeholderTextColor="#A9A9A9"
          value={phone}
          onChangeText={setphone}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.inputcontainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Enter your Email"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setemail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputcontainer}>
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

      <View style={styles.inputcontainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Confirm your Password"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          keyboardType="default"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  textcontainer: {
    marginVertical: 5, 
  },
  inputcontainer: {
    marginVertical: 5, 
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