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

const Friends = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [data, setdata] = useState([]); 
    
    // Get all Members Function
    const members = async () => {
      try {
          const response = await fetch(url + "Alluser");
          if (response.ok) {
              const data = await response.json();
              setdata(data.filter((item) => item.ID != Userid));
              console.log(data);
          } else {
              const errorText = await response.text();
              console.log(errorText);
          }
      } catch (error) {
          console.log(error);
      }
    };

    useEffect(() => {
        members();
    }, []);

    // Updated card-style render item
    const Show = ({ item }) => (
        <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color="#fff" />
                </View>
                <Text style={styles.cardText}>{item.name}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Friends</Text>
            </View>

            <FlatList
                data={data}
                renderItem={Show}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default Friends;

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
    listContainer: {
        paddingBottom: 20,
    },
    // Card styles
    cardContainer: {
        backgroundColor: colors.tasbeehconatiner,
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
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        flex: 1,
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