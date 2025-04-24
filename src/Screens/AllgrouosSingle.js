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


const AllgrouosSingle = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [combinedData, setCombinedData] = useState([]); // State to store combined data

    // Fetch All Groups
    const Allgroups = async () => {
        try {
            const query = `GroupTitles?memberId=${encodeURIComponent(Userid)}`;
            const response = await fetch(url + query);
            if (response.ok) {
                const data = await response.json();
                return data; 
            } else {
                const errorText = await response.text();
                console.log(errorText);
                return []; 
            }
        } catch (error) {
            console.log(error);
            return []; 
        }
    };

    // Fetch All Single Tasbeeh
    const AllSingle = async () => {
        try {
            const query = `GetAllSingletasbeehbyid?userid=${encodeURIComponent(Userid)}`;
            const response = await fetch(Singletasbeeh + query);
            if (response.ok) {
                const data = await response.json();
                return data; 
            } else {
                const errorText = await response.text();
                console.log(errorText);
                return []; 
            }
        } catch (error) {
            console.log(error);
            return []; // Return empty array if there's an error
        }
    };

    // Combine data from both APIs
    const fetchAndCombineData = async () => {
        const groups = await Allgroups();
        const singleTasbeehs = await AllSingle();
        const combined = [
            ...groups.map(item => ({ ...item, type: 'group' })), 
            ...singleTasbeehs.map(item => ({ ...item, type: 'single' })), 
        ];

        setCombinedData(combined); 
        
    };

    useEffect(() => {
        fetchAndCombineData(); 
    }, [combinedData]);

    // Render item for FlatList
    const Show = ({ item }) => (
        <TouchableOpacity
            onLongPress={() => {
                Alert.alert(
                    'Alert',
                    'Are you sure you want to delete?',
                    [
                        { text: 'Cancel' },
                        { text: 'Delete' },
                    ]
                );
            }}
            onPress={() => {
                if (item.type === 'group') {
                    navigation.navigate('TasbeehGroup', {"groupid":item.Groupid,"Userid":Userid,"Adminid":item.Adminid});
                } else {
                    navigation.navigate('SingleTasbeeh', { "tasbeehId": item.id });
                }
            }}
        >
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                    {item.type === 'group' ? item.Grouptitle : item.Title}
                </Text>
                {/* <Text style={{color:'black'}}>{item.Groupid}</Text> */}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Groups/Single</Text>
            </View>

            <FlatList
                data={combinedData}
                renderItem={Show}
            
            />

            <TouchableOpacity
                onPress={() => navigation.navigate('CreateGroupSingle', { Userid })}
                style={styles.fab}
            >
                <Ionicons name="add" size={40} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default AllgrouosSingle;

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
        fontWeight:'bold',
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