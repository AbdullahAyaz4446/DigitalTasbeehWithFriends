import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Maunnallycontribution = ({ route }) => {
    const navigation = useNavigation();
    const { groupid, Userid } = route.params;
    const [data, setdata] = useState([]);
    const [grouptitle, setgrouptitle] = useState();

    // Get All Group Members 
    const getallGroupMembers = async () => {
        try {
            const query = `ShowGroupmembers?groupid=${groupid}`;
            const responce = await fetch(SendRequest + query);
            if (responce.ok) {
                const data = await responce.json();
                setdata(data);
                setgrouptitle(data[0].GroupTitle);

                console.log(data);

            }
            else {
                console.log("Not fetch data");
            }

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        console.log("Group ID: ", groupid);
        getallGroupMembers();
    }, []);
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{grouptitle}</Text>
                </View>
                <View>
                    <Text style={[styles.headerTitle, { flex: 0 }]}>Group Members:{data.length}</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.headerTitle, { flex: 0 }]}>Group Members Details</Text>
                </View>

                <FlatList
                    data={data.sort((a, b) => a.Memmber.localeCompare(b.Memmber))}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            {Userid == item.Memberid ?
                                <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:"space-between" }}>
                                    <Text style={styles.itemText}>{item.Memmber}</Text>
                                    <Text style={[styles.itemText, { color: 'green', paddingRight:20}]}>Admin</Text>
                                </View>
                                :
                                <Text style={styles.itemText}>{item.Memmber}</Text>
                            }

                            <View style={styles.inputButtonContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Count"
                                    placeholderTextColor="#A9A9A9"
                                />
                                {/* <TouchableOpacity style={{
                                    backgroundColor: 'red',
                                    paddingVertical: 15,
                                    paddingHorizontal: 20,
                                    borderRadius: 30,
                                }}>
                                    <Text style={{
                                        color: colors.white,
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        textAlign: 'center',
                                    }}>Assign</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    )}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Assign</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemContainer: {
        width: '100%',
        marginVertical: 10,

    },
    itemText: {
        color: 'black',
        fontSize: 18,
        paddingLeft: 10
    },
    inputButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        borderRadius: 100,
        color: 'black',
        flex: 1,
        marginRight: 10,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: '10%',
        borderRadius: 30,
        marginTop: 10,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    },
});

export default Maunnallycontribution;