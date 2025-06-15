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

const AllTasbeehScreen = ({ route }) => {
  const { Userid } = route.params;
  const [tasbeeh, settasbeeh] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [existtasbeeh, setexisttasbeeh] = useState([]);
  const navigation = useNavigation();


  // All Tasbeeh Api Function
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


  // Delete Tasbeeh Api Function
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

  // Delete Wazifa Api Function
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

  // Create Chain Tasbeeh api function
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
          return ans;
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

  // Create Chain Tasbeeh compund data api function
  const CompundChaindata = async () => {
    try {
      const id = await Createexistingtasbeehchian();
      const updatedCompound = existtasbeeh.map((element) => ({
        Tasbeeh_id: id,
        Existing_Tasbeehid: element.ID
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

  // Use Effect To Get All Tasbeeh In the Screen Load
  useEffect(() => {
    Alltasbeeh();
  }, [editingItem]);

  // Usefocuseffect To Get All Tasbeeh when you come back
  useFocusEffect(
    React.useCallback(() => {
      Alltasbeeh();
    }, [])
  );

  // on long press to create compund api function
  const handleLongPress = (item) => {
    setEditingItem(true);
  };

  // Sawp data function 
  const Swapdata = (ID) => {
    setexisttasbeeh(predata => {
      const currentindex = predata.findIndex((item) => item.ID === ID);
      const copydata = [...predata];
      [copydata[currentindex], copydata[currentindex - 1]] =
        [copydata[currentindex - 1], copydata[currentindex]];
      return copydata;
    })
  };

  // Flat List To Show All Tasbeeh Function - Updated with Card View
  const Show = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}
      onPress={() => {
        if (editingItem) {
          settasbeeh(tasbeeh.filter(t => t.ID !== item.ID));
          setexisttasbeeh(prev => [...(prev || []), item]);
          console.log(existtasbeeh);
        }
      }}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.Tasbeeh_Title}</Text>
          <Text style={styles.cardSubtitle}>{item.Type}</Text>
        </View>
        {!editingItem && (
          <TouchableOpacity
            onPress={() => { item.type === "Quran" || "Compund" ? deletetasbeeh(item.ID) : Deletewazifa(item.ID) }}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  // Flat List To Show Existing Tasbeeh data - Updated with Card View
  const Showexistingtasbeehdata = ({ item, index }) => (
    <View style={styles.existingCardContainer}>
      <View style={styles.existingCardContent}>
        <View style={styles.existingCardTextContainer}>
          <Text style={styles.existingCardTitle}>{item.Tasbeeh_Title}</Text>
          <Text style={styles.existingCardSubtitle}>{item.Type}</Text>
        </View>

        <View style={styles.existingCardActions}>
          <TouchableOpacity
            onPress={() => {
              setexisttasbeeh(existtasbeeh.filter(t => t.ID !== item.ID));
              settasbeeh(prev => [...(prev || []), item]);
            }}
            style={styles.existingCardButton}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#ff4444" />
          </TouchableOpacity>

          {existtasbeeh.length > 1 && index !== 0 && (
            <TouchableOpacity
              onPress={() => Swapdata(item.ID)}
              style={styles.existingCardButton}
            >
              <Ionicons name="arrow-up-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // Main View
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {editingItem ? (
          <>
            <TouchableOpacity onPress={() => { setEditingItem(null), setexisttasbeeh([]), setEditTitle("") }}>
              <Ionicons name="close-circle-sharp" size={40} color="#ff4444" />
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
            <TouchableOpacity onPress={() => { CompundChaindata() }} >
              <Ionicons name="checkmark-circle-sharp" size={40} color="#4CAF50" />
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
        data={tasbeeh.reverse()}
        renderItem={Show}
        keyExtractor={(item) => item.ID.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {editingItem && (
        <View style={styles.existingChainContainer}>
          <View style={styles.chainHeader}>
            <Text style={styles.chainHeaderText}>Existing Tasbeeh Chain</Text>
          </View>
          <View style={styles.chainListContainer}>
            <FlatList
              data={existtasbeeh}
              renderItem={Showexistingtasbeehdata}
              keyExtractor={(item) => item.ID.toString()}
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
      )}
      <Modal transparent visible={showModal} animationType="fade">
  <View style={styles.modalOverlay}>
    <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
      <View style={styles.modalBackground} />
    </TouchableWithoutFeedback>
    
    <View style={styles.optionModalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Select Tasbeeh Type</Text>
        <TouchableOpacity
          onPress={() => setShowModal(false)}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalOptionsContainer}>
        <TouchableOpacity
          onPress={() => {
            setShowModal(false);
            navigation.navigate('CraeteTasbeeh', { "Userid": Userid });
          }}
          style={styles.modalOptionCard}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="book-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.modalOptionTitle}>Quran Tasbeeh</Text>
            <Text style={styles.modalOptionDescription}>Create from Quranic verses</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setShowModal(false);
            navigation.navigate('Wazifa', { "Userid": Userid });
          }}
          style={styles.modalOptionCard}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="sparkles-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.modalOptionTitle}>Wazifa Tasbeeh</Text>
            <Text style={styles.modalOptionDescription}>Create spiritual practices</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  headerTitle: {
    flex: 1,
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 25,
    color: 'black',
    backgroundColor: 'white',
  },

  // Card Styles for Main Tasbeeh List
  cardContainer: {
    backgroundColor: "#92A5E3",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },

  // Existing Chain Styles
  existingChainContainer: {
    marginTop: 20,
  },
  chainHeader: {
    backgroundColor: colors.notification,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  chainHeaderText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chainListContainer: {
    maxHeight: 300,
  },

  // Existing Card Styles
  existingCardContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  existingCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  existingCardTextContainer: {
    flex: 1,
  },
  existingCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  existingCardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  existingCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  existingCardButton: {
    padding: 8,
    marginLeft: 8,
  },

  // Modal Styles
 modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBackground: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
},
optionModalContainer: {
  backgroundColor: 'white',
  borderRadius: 16,
  width: '90%',
  maxWidth: 400,
  overflow: 'hidden',
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
modalTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: colors.primary,
  alignContent:'center'
  
},
closeButton: {
  padding: 4,
},
modalOptionsContainer: {
  padding: 16,
},
modalOptionCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
},
optionIconContainer: {
  backgroundColor: colors.primary + '20', 
  width: 48,
  height: 48,
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 16,
},
optionTextContainer: {
  flex: 1,
},
modalOptionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: 4,
},
modalOptionDescription: {
  fontSize: 13,
  color: '#7f8c8d',
},

  // FAB Style
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
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