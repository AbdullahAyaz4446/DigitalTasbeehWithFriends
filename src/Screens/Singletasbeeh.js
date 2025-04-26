import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Singletasbeeh = ({ route }) => {
  const navigation = useNavigation();
  const { Userid } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity>
          <Ionicons name="options" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>Your Progress:</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${0}%` }]} />
        </View>
      </View>
      
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
          {/* Deadline text can go here */}
        </Text>
      </View>
      
      <View style={styles.tasbeehNameContainer}>
        <View style={styles.tasbeehNameBackground}>
          <Text style={styles.tasbeehNameText}>Tasbeeh Name</Text>
        </View>
      </View>

      {/* Leave Button - Positioned at bottom left like the screenshot */}
      <TouchableOpacity style={styles.leaveButton}>
        <Text style={styles.leaveText}>Leave</Text>
      </TouchableOpacity>

      {/* FAB Button - Centered at bottom */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    color: 'black'
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
  tasbeehNameContainer: {
    padding: 20,
    backgroundColor: colors.tasbeehconatiner,
    borderRadius: 30,
    marginTop: 20,
  },
  tasbeehNameBackground: {
    backgroundColor: 'pink',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
  tasbeehNameText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  leaveButton: {
    position: 'absolute',
    bottom: 200, 
    left: 20,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderTopRightRadius: 20,

  },
  leaveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
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

export default Singletasbeeh;