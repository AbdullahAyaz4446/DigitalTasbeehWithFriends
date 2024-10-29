import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { colors } from '../utiles/colors'; 
import { useNavigation } from '@react-navigation/native'; 

const { width, height } = Dimensions.get('window');

const StartScreen = () => {
  const navigation = useNavigation(); 

  const handleLogin = () => {
    console.log('Button Pressed!'); 
    navigation.navigate('Login'); 
  };
  
  return (
    <View style={styles.container}>
      <Image source={require("../Assests/makkah.png")} style={styles.Tasbeehimage} />
      
      <View style={styles.row}>
        <Text style={styles.Text}>Digital Tasbeeh</Text>
        <Image source={require('../Assests/beads.png')} style={styles.logo} />
      </View>
    
      <Text style={[styles.Description, { paddingTop: height * 0.03 }]}>Welcome to Digital Tasbeeh!</Text>
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
    width: width * 0.7,
    height: height * 0.35,
    marginTop: height * 0.15,
    marginBottom: height * 0.08,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  logo: {
    width: width * 0.1,
    height: width * 0.1,
    marginLeft: width * 0.02,
  },
  Text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.06,
    marginLeft: width * 0.02,
  },
  Description: {
    fontSize: width * 0.04,
    color: 'black',
    textAlign: 'center',
  },
  button: {         
    backgroundColor: colors.primary,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.25,
    borderRadius: width * 0.08,
    marginTop: height * 0.05,
  },
  buttonText: {
    color: colors.white,          
    fontWeight: 'bold',      
    fontSize: width * 0.06,             
    textAlign: 'center',
  }
});
