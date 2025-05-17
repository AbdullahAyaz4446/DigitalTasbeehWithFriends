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
    const [combinedData, setCombinedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [seleteditem, setselecteditem] = useState(null);

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
            return [];
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
        setCombinedData(combined.reverse());
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
                if (Userid == item.Adminid && item.type == 'group' || item.type == 'single') {
                    setselecteditem(item);
                    setShowModal(true);
                }
            }}
            onPress={() => {
                if (item.type === 'group') {
                    navigation.navigate('Allgrouptasbeeh', { "groupid": item.Groupid, "Userid": Userid, "Adminid": item.Adminid, "title": item.Grouptitle });
                } else {
                    navigation.navigate('Allsingletasbeeh', { "tasbeehId": item.ID, "Name": item.Title });
                }
            }}
            style={styles.cardTouchable}
        >
            <View style={styles.cardContainer}>
                <View style={styles.cardContent}>
                    <Ionicons 
                        name={item.type === 'group' ? 'people' : 'person'} 
                        size={24} 
                        color="black" 
                        style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>
                        {item.type === 'group' ? item.Grouptitle : item.Title}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
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
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate('CreateGroupSingle', { Userid })}
                style={styles.fab}
            >
                <Ionicons name="add" size={40} color="white" />
            </TouchableOpacity>
            
            <Modal transparent visible={showModal} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                Do You Want to Delete this {seleteditem?.type === 'group' ? 'Group' : 'Single'}?
                            </Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    onPress={() => setShowModal(false)}
                                    style={styles.cancelButton}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { 
                                        seleteditem.type === 'group' 
                                            ? Deletegroup(seleteditem.Groupid) 
                                            : DeleteSingle(seleteditem.ID); 
                                        setShowModal(false); 
                                        fetchAndCombineData(); 
                                    }}
                                    style={styles.deleteButton}>
                                    <Text style={styles.buttonText}>Delete</Text>
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
        backgroundColor: '#f5f5f5',
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
    cardTouchable: {
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#92A5E3",
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        marginRight: 15,
        padding: 10,
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 18,
        color: 'black',
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1e3a8a',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 20,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
        color: 'black',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: colors.tasbeehconatiner,
        padding: 12,
        borderRadius: 10,
        width: '48%',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 10,
        width: '48%',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
});