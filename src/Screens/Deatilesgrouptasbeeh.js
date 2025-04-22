import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Deatilesgrouptasbeeh = () => {
  return (
    <View>
      <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tasbeeh Group</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Deatilesgrouptasbeeh")}>
              <Ionicons name="options" size={30} color="#000" />
            </TouchableOpacity>
          </View>
    </View>
  )
}

export default Deatilesgrouptasbeeh

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
    color:'black'
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