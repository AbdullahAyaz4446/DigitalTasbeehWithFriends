import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    Alert
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Maunnallycontribution = ({ route }) => {
    const navigation = useNavigation();
    const { groupid, Userid, Tasbeeh_id, Goal, End_date } = route.params;
    const [data, setdata] = useState([]);
    const [grouptitle, setgrouptitle] = useState();
    const [groupmembersid, setgroupmembersid] = useState([]);
    const [count, setcount] = useState([]);

    //Assign  Tasbeeh api function
    const Assigntasbeeh = async () => {
        const numericCount = count.map(val => parseInt(val) || 0);
        const overLimit = numericCount.some(val => val > Goal);
        if (overLimit) {
            Alert.alert("Error", "One or more users have a count greater than the goal. Please adjust the values.");
            return;
        }

        const sum = numericCount.reduce((total, item) => total + item, 0);


        console.log("Function is calling");
        const AssignTasbeehobj = {
            Group_id: groupid,
            Tasbeeh_id: Tasbeeh_id,
            Goal: Goal,
            End_date: End_date,
        };

        try {
            if (sum < Goal||sum==Goal||sum<Goal) {
                console.log("hello" + JSON.stringify(AssignTasbeehobj));
                const response = await fetch(AssignTasbeh + 'AssignTasbeeh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(AssignTasbeehobj),
                });

                if (response.ok) {
                    const ans = await response.json();
                    console.log("hello muannly calling")
                    Distributemunally();
                } else {
                    const ans = await response.text();
                    console.log(ans);
                }

            } else {
                Alert.alert("Error", "The total assigned count are not full fill the requiremnts");
            }
        } catch (error) {
            console.log(error.message);
        }

    };

    //Distrbute Tasbeeh Manually
    const Distributemunally = async () => {
        try {
            const formData = new FormData();
            formData.append("groupid", groupid.toString());

            formData.append("id", JSON.stringify(groupmembersid));
            formData.append("count", JSON.stringify(count));

            const distributionResponse = await fetch(SendRequest + 'DistributeTasbeehManually', {
                method: 'POST',
                body: formData,
            });

            if (distributionResponse.ok) {
                navigation.goBack();
                navigation.goBack();
            } else {
                const errorData = await distributionResponse.json();
                throw new Error(errorData.message || "Failed to distribute tasbeeh");
            }

        } catch (error) {
            console.error("Error distributing tasbeeh:", error);
        }
    };

    // Get All Group Members 
    const getallGroupMembers = async () => {
        try {
            const query = `ShowGroupm?groupid=${groupid}`;
            const responce = await fetch(SendRequest + query);
            if (responce.ok) {
                const data = await responce.json();
                setdata(data);
                setgrouptitle(data[0].GroupTitle);
                setgroupmembersid(data.map(item => item.Memberid));
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
        console.log("COunt", count);
        console.log("Ids", groupmembersid);
    }, [count]);

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
                    // data={data.sort((a, b) => b.Memberid - a.Memberid)}

                    renderItem={({ item, index }) => (
                        <View style={styles.itemContainer}>
                            {Userid == item.Memberid ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                    <Text style={styles.itemText}>{item.Memmber}</Text>
                                    <Text style={[styles.itemText, { color: 'green', paddingRight: 20 }]}>Admin</Text>
                                </View>
                                :
                                <Text style={styles.itemText}>{item.Memmber}</Text>
                            }

                            <View style={styles.inputButtonContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Count"
                                    placeholderTextColor="#A9A9A9"
                                    keyboardType="numeric"
                                    value={count[index] || ''}
                                    onChangeText={(value) => {
                                        const newCount = [...count];
                                        newCount[index] = value;
                                        setcount(newCount);
                                    }}
                                />
                            </View>
                        </View>
                    )}
                />

            </View>
            <View>
                <TouchableOpacity onPress={() => Assigntasbeeh()} style={styles.button}>
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