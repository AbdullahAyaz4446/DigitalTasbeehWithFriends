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
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';


const AllgrouosSingle = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [combinedData, setCombinedData] = useState([]); // State to store combined data
    const [showModal, setShowModal] = useState(false);
    const[seleteditem,setselecteditem]=useState(null);


    useEffect(() => {
        fetchAndCombineData();
    }, [combinedData]);
    useEffect(() => {
        fetchAndCombineData();
    }, []);


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

    // Delete Group Api Function
    const Deletegroup = async (id) => {
        try {
            const query = `Deletegroup?id=${encodeURIComponent(id)}`;
            const response = await fetch(Group + query);
            if (response.ok) {
                const res = await response.text();
                console.log(res);

            }
            else {
                const res = await response.text();
                console.log(res);
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Delete Single Api Function
    const DeleteSingle = async (id) => {
        try {
            console.log(id);
            const query = `deletesingle?id=${encodeURIComponent(id)}`;
            const response = await fetch(Singletasbeeh + query);
            if (response.ok) {
                const res = await response.text();
                console.log(res);
            }
            else {
                const res = await response.text();
                console.log(res);
            }

        } catch (error) {
            console.log(error);
        }
    }



    // Render item for FlatList
    const Show = ({ item }) => (
        <TouchableOpacity
            onLongPress={() => {
                setselecteditem(item);
                setShowModal(true);
            }}
            onPress={() => {
                if (item.type === 'group') {
                    navigation.navigate('TasbeehGroup', { "groupid": item.Groupid, "Userid": Userid, "Adminid": item.Adminid });
                } else {
                    navigation.navigate('Singletasbeeh', { "tasbeehId": item.ID,"Name":item.Title});
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
            <Modal transparent visible={showModal} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, width: '90%', height: '25%' }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: 'black' }}>
                                Do You Want to Delete this {seleteditem?.type === 'group' ? 'Group' : 'Single'}
                            </Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={() => setShowModal(false)}
                                    style={{ backgroundColor: colors.tasbeehconatiner, padding: 10, borderRadius: 10, width: '48%' }}>
                                    <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {seleteditem.type==='group'?Deletegroup(seleteditem.Groupid):DeleteSingle(seleteditem.ID);setShowModal(false);fetchAndCombineData();}}
                                    style={{ backgroundColor: 'red', padding: 10, borderRadius: 10, width: '48%' }}>
                                    <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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