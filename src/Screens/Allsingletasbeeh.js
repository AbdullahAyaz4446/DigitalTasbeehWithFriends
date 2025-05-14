import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Allsingletasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const {tasbeehId,Name} = route.params;
    const [logdata, setlogdata] = useState([]);

    const getlogeddata = async () => {
        try {
          const query = `Getallsingletasbeehlog?id=${encodeURIComponent(tasbeehId)}`;
          const responce = await fetch(Singletasbeeh + query);
          if (responce.ok) {
            const result = await responce.json();
            console.log(result);
            setlogdata(result);
          }
          else {
            const result = await responce.json();
            console.log(result);
          }
        } catch (error) {
          console.log(error);
        }
      }
    

    useEffect(() => {
        getlogeddata();
    }, [tasbeehId]);

    const Show = ({ item }) => (
        <TouchableOpacity
        onPress={()=>{
            navigation.navigate("Singletasbeeh",{
                "tasbeehId":tasbeehId,"Name":Name,"tid":item.ID
            })
        }}

        >
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                   {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{Name}</Text>
            </View>

            <FlatList
                data={logdata}
                renderItem={Show}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No tasbeeh logs found</Text>
                    </View>
                }
            />
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
        alignItems: 'center',
        padding: 25,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.tasbeehconatiner,
    },
    itemText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        paddingLeft: 10,

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

export default Allsingletasbeeh;