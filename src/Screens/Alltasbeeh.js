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
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { AntDesign } from 'react-native-vector-icons/AntDesign';

const AllTasbeehScreen = ({ route }) => {
  {/*Varaiables*/ }
  const { Userid } = route.params;
  const [tasbeeh, settasbeeh] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [existtasbeeh, setexisttasbeeh] = useState([]);

  const navigation = useNavigation();
  // All Wazifa Api Function
  // const Allwazifa = async () => {
  //   try {
  //     const query = `Alltasbeeh?id=${encodeURIComponent(Userid)}`;
  //     const responce = await fetch(tasbeehurl + query);
  //     if (responce.ok) {
  //       const data = await responce.json();
  //       console.log(data);
  //       setwazifa(data);
  //     }
  //     else {
  //       const ans = await responce.text();
  //       console.log(ans);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }
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
        var tasbeehid = await responce.json();
        Alltasbeeh();
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
      const query = `Deletecompletewazifa?id=${encodeURIComponent(id)}&userid=${encodeURIComponent(Userid)}`;
      const responce = await fetch(Wazifa + query);
      if (responce.ok) {
        Alltasbeeh();
        console.log("calling delete");
      }
    } catch (error) {
      console.log(error);
    }
  }
  {/*Create Chain Tasbeeh api function*/ }
  //Add Wazifa Title Api Function
  const Createexistingtasbeehchian = async () => {

    try {
      if (editTitle) {
        const obj = {
          "Tasbeeh_Title": editTitle,
          "User_id": Userid,
          "Type": "Compund",
        };
        const responce = await fetch(tasbeehurl + "createtasbeehtitle", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj),
        });
        if (responce.ok) {
          const ans = await responce.json();
          console.log("Api responce", ans);
          CompundChaindata(ans.id);
        }
        else {
          const ans = await responce.json();
          console.log(ans);
        }
      }
      else {
        Alert.alert("Please Enter Title");
      }
    } catch (error) {
      console.log(error);
    }
  }
  {/*Create Chain Tasbeeh compund data api function*/ }

  const CompundChaindata = async (id) => {
    try {

      const updatedCompound = existtasbeeh.map((element) => ({
        Existing_Tasbeehid: element.Existing_Tasbeehid,
        Tasbeeh_id: id
      }));
      console.log("Updated Compound", updatedCompound);
      const query = `chaintasbeeh`;
      const responce = await fetch(tasbeehurl + query, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCompound)
      });
      if (responce.ok) {
        const ans = await responce.json();
        console.log("Api responce", ans);

        setexisttasbeeh([]);
        setEditingItem(null);
      }
      else {
        const ans = await responce.json();
        console.log("Api responce", ans);
      }
    } catch (error) {
      console.log(error);
    }
  }


  {/*Use Effect To Get All tasbeeh and wazifa and compund unwanted code  */ }

  // useEffect(() => {
  //   const combine = [
  //     ...tasbeeh.map(item => ({ ...item, type: 'Tasbeeh' })),
  //     ...wazifa.map(item => ({ ...item, type: 'Wazifa' }))
  //   ];
  //   setcompund(combine);
  // }, [tasbeeh, wazifa]);

  {/*Use Effect To Get All Tasbeeh In the Screen Load*/ }
  useEffect(() => {
    Alltasbeeh();
  }, [editingItem]);
  useFocusEffect(
    React.useCallback(() => {
      Alltasbeeh();
    }, [])
  );


  const handleLongPress = (item) => {
    setEditingItem(true);
  };
  const Swapdata = (ID) => {
    setexisttasbeeh(predata => {
      const currentindex = predata.findIndex((item) => item.ID === ID);
      const copydata = [...predata];
      [copydata[currentindex], copydata[currentindex - 1]] =
        [copydata[currentindex - 1], copydata[currentindex]];
      return copydata;
    })
  };


  {/*Flat List To Show All Tasbeeh Function*/ }
  const Show = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}

      onPress={() => {
        if (editingItem) {
          settasbeeh(tasbeeh.filter(t => t.ID !== item.ID));
          setexisttasbeeh(prev => [...(prev || []), item]);
        }
      }}

    >
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>{item.Tasbeeh_Title}</Text>
          {/* {!editingItem &&
            (<TouchableOpacity>
              <Image source={require('../Assests/pencil.png')} style={styles.logo} />
            </TouchableOpacity>)
          } */}

        </View>
        {!editingItem && (<TouchableOpacity onPress={() => { item.type === "Quran" || "Compund" ? deletetasbeeh(item.ID) : Deletewazifa(item.ID) }}>
          <Image source={require('../Assests/trash.png')} style={styles.logo} />
        </TouchableOpacity>)}
      </View>
    </TouchableOpacity>
  );
  {/*Flat List To Show Existing Tasbeeh  data*/ }
  const Showexistingtasbeehdata = ({ item, index }) => (
    <View style={{ marginVertical: 10, backgroundColor: colors.tasbeehconatiner, borderRadius: 20 }}>
      <View style={{ marginHorizontal: 20, marginTop: 10 }}>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 20 }}>
        <View>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{item.Tasbeeh_Title}</Text>
        </View>
        <View >
          <TouchableOpacity onPress={() => {
            setexisttasbeeh(existtasbeeh.filter(t => t.ID !== item.ID));
            settasbeeh(prev => [...(prev || []), item]);

          }}>
            <Image source={require('../Assests/trash.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>

        {existtasbeeh.length > 1 && index !== 0 && (
          <View >
            <TouchableOpacity onPress={() => Swapdata(item.ID)}>
              <Ionicons name="caret-up-circle" size={40} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {editingItem ? (
          <>
            <TouchableOpacity onPress={() => { setEditingItem(null), setexisttasbeeh([]) }}>
              <Ionicons name="close-circle-sharp" size={40} color="#000" />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Enter title"
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity onPress={() => { Createexistingtasbeehchian() }} >
              <Ionicons name="checkmark-circle-sharp" size={40} color="green" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>All Tasbeeh</Text>
            </View>
            <View style={{ width: 40 }} />
          </>
        )}
      </View>
      <FlatList
        data={tasbeeh}
        renderItem={Show}
      />
      {editingItem && (
        <View style={{ marginTop: 15 }}>
          <View style={{ backgroundColor: colors.notification, borderRadius: 20, padding: 10 }}>
            <Text style={{
              color: 'black',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              textAlign: 'center',
            }}>  Existing Tasbeeh Chain
            </Text>
          </View>
          <View style={{ maxHeight: 300 }}>
            <FlatList
              data={existtasbeeh}
              renderItem={Showexistingtasbeehdata}
            />
          </View>
        </View>
      )}

      {!editingItem && (
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.fab}
        >
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>
      )
      }

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
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  selectedCount: {
    fontSize: 16,
    color: colors.primary,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 100,
    color: 'black',

  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default AllTasbeehScreen;  