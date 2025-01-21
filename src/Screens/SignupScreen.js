import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../utiles/colors'; 
import { ScrollView } from 'react-native-gesture-handler';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [Email, setemail] = useState('');
  const [Password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [Username, setname] = useState('');
  const Signupuser = async () => {
    if (Password === cpassword) {
      const User = {
        Username: Username,
        Email: Email,
        password: Password
      };
  
      try {
        const response = await fetch(url+"Signup", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(User)
        });
  
        if (response.ok) {
          const ans = await response.text();
          console.log(ans); 
          navigation.goBack();
        } else {
          const ans = await response.text();
          console.log(ans);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log("Passwords do not match");
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.textcontainer}>
        <Text style={styles.headingtext}>Let's get</Text>
        <Text style={styles.headingtext}>Started</Text>
      </View>

<View>
  
<View style={styles.inputcontainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Enter your username"
          placeholderTextColor="#A9A9A9"
          value={Username}
          onChangeText={setname}
        />
      </View>

   

      <View style={styles.inputcontainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Enter your Email"
          placeholderTextColor="#A9A9A9"
          value={Email}
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
          value={Password}
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
          value={cpassword}
          onChangeText={setcPassword}
          keyboardType="default"
          secureTextEntry
        />
      </View>
  
</View>
  


     

      <TouchableOpacity onPress={Signupuser} style={styles.button}>
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
