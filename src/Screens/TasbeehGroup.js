import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const TasbeehGroup = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);



  // Function to increment progress
  const incrementProgress = () => {
    if (progress < 100) {
      setProgress(progress + 1); 
    } else {
      Alert.alert('Completed', 'You have reached 100% progress!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasbeeh Group</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="options" size={30} color="#000" />
        </TouchableOpacity>
      </View>

   
      <View style={styles.progressContainer}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>Your Progress: {progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
      </View>

   
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={incrementProgress}>
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TasbeehGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTextContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
  },
  progressBar: {
    height: 30,
    width: '50%',
    backgroundColor: '#e0e0e0',
    borderRadius: 40,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center', // Center horizontally
  },
  fab: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});