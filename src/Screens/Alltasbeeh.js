import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const AllTasbeehScreen = ({ route }) => {
  {/*Varaiables*/ }
  const { Userid } = route.params;
  const [tasbeeh, settasbeeh] = useState([]);
  const [wazifa, setwazifa] = useState([]);
  const [compund, setcompund] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  // All Wazifa Api Function
  const Allwazifa = async () => {
    try {
      const query = `Allwazifa?id=${encodeURIComponent(Userid)}`;
      const responce = await fetch(url + query);
      if (responce.ok) {
        const data = await responce.json();
        console.log(data);
        setwazifa(data);
      }
      else {
        const ans = await responce.text();
        console.log(ans);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  {/*All Tasbeeh Api Function*/ }
  const Alltasbeeh = async () => {
    try {

      const query = `Alltasbeeh?userid=${encodeURIComponent(Userid)}`;
      const response = await fetch(tasbeehurl + query);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        settasbeeh(data);

      } else {
        const ans = await response.text();
        console.log(ans);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  {/*Delete Tasbeeh Api Function*/ }
  const deletetasbeeh = async (ID) => {
    console.log("delete tasbeeh is calling");
    try {
      const query = `Deletetasbeeh?userid=${encodeURIComponent(Userid)}&tabseehid=${encodeURIComponent(ID)}`;
      const responce = await fetch(tasbeehurl + query);
      if (responce.ok) {
        Alltasbeeh();
        var tasbeehid = await responce.json();
      }
      else {
        const ans = await responce.text();
        console.log(ans);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  {/*Delete Tasbeeh Api Function*/ }
  const Deletewazifa = async (id) => {
    console.log("calling delete");
    try {
      const query=`Deletecompletewazifa?id=${encodeURIComponent(id)}&userid=${encodeURIComponent(Userid)}`;
      const responce =await fetch(Wazifa+query);
      if(responce.ok){
        Allwazifa();
        console.log("calling delete");
      }
    } catch (error) {
      console.log(error);
    }
  }

  {/*Use Effect To Get All tasbeeh and wazifa and compund*/ }

  useEffect(() => {
    const combine = [
      ...tasbeeh.map(item => ({ ...item, type: 'Tasbeeh' })),
      ...wazifa.map(item => ({ ...item, type: 'Wazifa' }))
    ];
    setcompund(combine);
  }, [tasbeeh, wazifa]);

  {/*Use Effect To Get All Tasbeeh In the Screen Load*/ }
  useEffect(() => {
    Allwazifa();
    Alltasbeeh();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      Allwazifa();
      Alltasbeeh();
    }, [])
  );

  {/*Flat List To Show All Tasbeeh Function*/ }
  const Show = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        {item.type === 'Tasbeeh' ?
          <Text style={styles.itemText}>{item.Tasbeeh_Title}</Text>
          :
          <Text style={styles.itemText}>{item.Wazifa_Title}</Text>
        }
        <TouchableOpacity>
          <Image source={require('../Assests/pencil.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => { item.type === "Tasbeeh" ? deletetasbeeh(item.ID) :Deletewazifa(item.id)}}>
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
        data={compund}
        renderItem={Show}
      />
      <TouchableOpacity

        onPress={() => setShowModal(true)}
        style={styles.fab}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
      <Modal transparent visible={showModal} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, width: '90%', height: '30%' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: 'black' }}>Select Option</Text>
              <TouchableOpacity onPress={() => {
                setShowModal(false);
                navigation.navigate('CraeteTasbeeh', { "Userid": Userid })
              }
              } style={{ backgroundColor: colors.tasbeehconatiner, padding: 10, borderRadius: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Quran Tasbeeh</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowModal(false);
                navigation.navigate('Wazifa', { "Userid": Userid })
              }} style={{ backgroundColor: colors.tasbeehconatiner, padding: 10, borderRadius: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Wazifa Tasbeeh</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </Modal>


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
    padding: 20,
    marginVertical: 10,
    borderRadius: 25,
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
  }
});

export default AllTasbeehScreen;
