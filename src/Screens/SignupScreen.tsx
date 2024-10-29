import { StyleSheet, View, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../utiles/colors'; 

const { width, height } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-sharp" size={width * 0.1} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Let's get</Text>
        <Text style={styles.headingText}>Started</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#A9A9A9"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Phone Number"
          placeholderTextColor="#A9A9A9"
          value={phone}
          onChangeText={setPhone}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your Password"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
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
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  textContainer: {
    marginVertical: height * 0.02, 
  },
  inputContainer: {
    marginVertical: height * 0.02, 
  },
  headingText: {
    fontSize: width * 0.1,
    color: 'black',
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    paddingLeft: width * 0.02,
  },
  input: {
    height: height * 0.07,
    borderColor: '#000',
    borderWidth: 1,
    padding: width * 0.03,
    borderRadius: width * 0.5,
    color: 'black',
  },
  button: {         
    backgroundColor: colors.primary, 
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.15,
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
