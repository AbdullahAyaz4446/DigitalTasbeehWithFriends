import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { colors } from '../utiles/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { OnlineContext } from './OnlineContext';


const Singletasbeehdeatiles = ({ route }) => {
  const navigation = useNavigation();
  const { tasbeehid,Name} = route.params;
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{Name}</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>

            <MaterialIcons name="delete" size={35} color="#000" />
        
        </TouchableOpacity>
      </View>
    
      <View>

        <Logs
          tasbeehid={tasbeehid}
        />

      </View>
      <Modal transparent visible={showModal} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, width: '90%', height: '25%' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: 'black' }}>
                Do You Want to Delete this Group
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={{ backgroundColor: colors.tasbeehconatiner, padding: 10, borderRadius: 10, width: '48%' }}>
                  <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { deleteGroup() }}
                  style={{ backgroundColor: 'red', padding: 10, borderRadius: 10, width: '48%' }}>
                  <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Delete</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  )
}

export default Singletasbeehdeatiles

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
     
  },
  headerTitle: {
      flex: 1,
      color: 'black',
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
  },

  itemText: {
      color: 'black',
      fontSize: 16,
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold'
  },
  logcontainer: {
      backgroundColor: colors.tasbeehconatiner, marginVertical: 5, borderRadius: 20, padding: 20,
  },
  logtext: {
      fontSize: 16, color: 'black', fontWeight: 'bold'
  }

}); 



// Show log component
const Logs = ({ tasbeehid }) => {
  const [logdata, setlogdata] = useState([]);
 const getlogeddata=async()=>{
  try {
    const query=`Getallsingletasbeehlog?id=${encodeURIComponent(tasbeehid)}`;
    const responce=await fetch(Singletasbeeh+query);
    if(responce.ok){
      const result=await responce.json();
      console.log(result);
      setlogdata(result);
    }
    else{
      const result=await responce.json();
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
 }


  useEffect(() => {
    getlogeddata();
  }, []);

  const show = ({ item }) => (
    <View style={styles.logcontainer}>
      <Text style={styles.logtext}>Title:          {item.title}</Text>
      <Text style={styles.logtext}>Goal:          {item.Goal}</Text>
      <Text style={styles.logtext}>Achieved:   {item.Achieved} </Text>
      <Text style={styles.logtext}>Remaning: {item.Goal - item.Achieved}</Text>
      <View style={{ flexDirection: 'row', justifyContent: item.Enddate == null ? 'flex-end' : 'space-between' }}>
        {item.Enddate != null && (
          <Text style={styles.logtext}>DeadLine:  {item.Enddate?.split('T')[0] || 'Not set'}</Text>
        )
        }
        {item.status == "Unactive" && (
          <TouchableOpacity >
            <View style={{ backgroundColor: colors.primary, padding: 5, borderRadius: 15 }}>
              <Text style={[styles.logtext, { color: "white" }]}>Resume</Text>
            </View>
          </TouchableOpacity>
        )
        }
      </View>

    </View>
  )
  // Sort the data  function
  const sortedLogData = [...logdata].sort((a, b) => {
    if (a.status === "Active" && b.status !== "Active") return -1;
    if (a.status !== "Active" && b.status === "Active") return 1;
    return 0;
  });
  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={sortedLogData}
        renderItem={show}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      />
    </View>
  )
}