import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const AllTasbeehScreen = ({ route }) => {
  const [tasbeeh, settasbeeh] = useState([]);
  const navigation = useNavigation();
  const { Userid } = route.params;

  

  const Alltasbeeh = async () => {
    try {
     
      const query = `Alltasbeeh?userid=${encodeURIComponent(Userid)}`;
      const response=await fetch(tasbeehurl+query);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        settasbeeh(data);
      } else {
        console.error('Failed to fetch tasbeeh:', response.status);
        Alert.alert('Error', 'Failed to load tasbeeh. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching tasbeeh:', error);
      Alert.alert('Error', 'Something went wrong. Please check your network.');
    }
  };
  const deletetasbeeh=async(ID)=>{
    try {
      const query = `Deletetasbeeh?userid=${encodeURIComponent(Userid)}&tabseehid=${encodeURIComponent(ID)}`;
      const responce=await fetch(tasbeehurl+query);
      if (response.ok) {
        var tasbeehid = await response.json();
        console.log(tasbeehid); 
    }
    else{
        const ans = await responce.text();
        console.log(ans);
      }
    } catch (error) {
      console.log(error.message);
    }
   
  }

  useEffect(() => {
    Alltasbeeh();
  }, [Alltasbeeh]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{item.Tasbeeh_Title}</Text>
        <TouchableOpacity>
          <Image source={require('../Assests/pencil.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={()=>{deletetasbeeh(item.ID);}}>
        <Image source={require('../Assests/trash.png')} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Tasbeeh</Text>
      </View>
      <FlatList
        data={tasbeeh}
        renderItem={renderItem}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CraeteTasbeeh', { "Userid":Userid })
        }
        style={styles.fab}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.tasbeehconatiner,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    color: 'black',
  },
  logo: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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

export default AllTasbeehScreen;
