import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../utiles/colors'; 
import { useNavigation } from '@react-navigation/native'; 

const StartScreen = () => {
  const navigation = useNavigation(); 

  const handleLogin = () => {
    console.log('Button Pressed!'); 
    navigation.replace('Login');
  };
  
  return (
    <View style={styles.container}>
      <Image source={require("../Assests/hand-drawn-flat-design-tasbih-illustration-b.png")} style={styles.Tasbeehimage} />
      
      <View style={styles.row}>
        <Text style={styles.Text}>Digital Tasbeeh</Text>
        <Image source={require('../Assests/mosque_9987994.png')} style={styles.logo} />
      </View>
    
      <Text style={[styles.Description, { paddingTop: 30 }]}>Welcome to Digital Tasbeeh!</Text>
      <Text style={styles.Description}>Start counting your blessings with ease and</Text>
      <Text style={styles.Description}>accuracy.</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  Tasbeehimage: {
    width: 258,
    height: 276,
    marginTop: 150,
    marginBottom: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 38,
    height: 38,
    marginLeft: 10,
  },
  Text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: 10,
  },
  Description: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  button: {         
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 30,
    marginTop: 50,
  },
  buttonText: {
    color: colors.white,          
    fontWeight: 'bold',      
    fontSize: 24,             
    textAlign: 'center',
  }
}); 