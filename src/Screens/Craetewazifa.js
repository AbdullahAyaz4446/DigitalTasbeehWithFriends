import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList, Image, Alert
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { SelectList } from 'react-native-dropdown-select-list';


const Craetewazifa = ({ route }) => {
    {/*Varaiables*/ }
    const { Userid } = route.params;
    const [wazifatitle, setwazifatitle] = useState('');
    const [wazifatext, setwazifatext] = useState('');
    const [Count, setcount] = useState('');
    const [compund, setcompund] = useState([]);
    const [data, setdata] = useState([]);
    const navigation = useNavigation();

    //Add Wazifa Title Api Function
    const addwazifatitle = async () => {

        try {
            if (wazifatitle) {
                const obj = {
                    "Tasbeeh_Title": wazifatitle,
                    "User_id": Userid,
                    "Type": "Wazifa",
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
                    setwazifatitle('');
                    return ans;
                }
                else {
                    const ans = await responce.json();
                    console.log(ans);
                }
            }
            else {
                Alert.alert("Please Enter Wazifa Title");
            }
        } catch (error) {
            console.log(error);
        }
    }
    //  Add wazifa text Api Function
    const addwazifatext = async () => {
        try {
            if (wazifatext && Count) {
                const obj = {
                    "text": wazifatext,
                    "count": Count,
                };
                const responce = await fetch(Wazifa + "Addwazifatext", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj),
                });
                if (responce.ok) {
                    const ans = await responce.json();
                    console.log(ans);
                    setdata([...data, ans]);
                    console.log("Data", data);
                    setcompund(prev => [...prev, { "wazifa_text_id": ans.id }]);
                    setwazifatext('');
                    setcount('');
                }
                else {
                    const ans = await responce.json();
                    console.log(ans);
                }
            }
            else {
                Alert.alert("Please Enter Wazifa Text and Count");
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Delete wazifatext api function
    const Deletewazifatext = async (id) => {
        try {
            const query = `Deletwazifatext?id=${encodeURIComponent(id)}`;
            const responce = await fetch(Wazifa + query);
            if (responce.ok) {
                setcompund(compund.filter((item) => item.wazifa_text_id !== id));
                setdata(data.filter((item) => item.id !== id)); // Update FlatList data
                const ans = await responce.text();
            }
            else {
                const ans = await responce.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Compund wazifa Api function
    const CompundWazifadata = async () => {

        if (compund.length > 0) {
            const id = await addwazifatitle();
            try {
                const updatedCompund = compund.map((element) => ({
                    ...element,
                    Wazifa_id: id,
                }));

                const response = await fetch(Wazifa + "Createcompundwazifa", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedCompund),
                });

                if (response.ok) {
                    navigation.goBack();
                    const ans = await response.json();
                    console.log(ans);

                } else {
                    const ans = await response.text();
                    console.log("Error:", ans);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    };
  
    // Function to swap data
    const Swapdata = (id) => {
        setdata(prevData => {
            // Find the index of the item with matching id
            const currentIndex = prevData.findIndex(item => item.id === id);
            console.log("current index",currentIndex)
            // Create a new array to avoid mutating state directly
            const newData = [...prevData];
            // Swap current item with the previous one
            // [newData[currentIndex], newData[currentIndex - 1]] =
            //     [newData[currentIndex - 1], newData[currentIndex]];
            [newData[currentIndex],newData[currentIndex-1]]=
            [newData[currentIndex-1],newData[currentIndex]];

            return newData;
        });

        // Also update compund state to keep them in sync
        setcompund(prevCompund => {
            const currentIndex = prevCompund.findIndex(item => item.wazifa_text_id === id);
            const newCompund = [...prevCompund];
            [newCompund[currentIndex], newCompund[currentIndex - 1]] =
                [newCompund[currentIndex - 1], newCompund[currentIndex]];
            return newCompund;
        });
    };

    useEffect(() => {
        console.log("Current compound state:", compund);
    }, [compund]);


    const showdata = ({ item, index }) => (
        <View style={{ marginVertical: 10, backgroundColor: colors.tasbeehconatiner, borderRadius: 20 }}>
            <View style={{ margin: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Arabic:{item.text}</Text>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Count:{item.count}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ alignItems: 'center', marginVertical: 20, marginLeft: 20 }}>
                    <TouchableOpacity onPress={() => Deletewazifatext(item.id)}>
                        <Image source={require('../Assests/trash.png')} style={styles.logo} />
                    </TouchableOpacity>
                </View>

                {data.length > 1 && index !== 0 && (
                    <View style={{ alignItems: 'center', marginVertical: 20, marginRight: 20 }}>
                        <TouchableOpacity onPress={() => Swapdata(item.id)}>
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
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Wazifa</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter Wazifa Title</Text>
                <TextInput
                    style={[styles.input, { color: 'black' }]}
                    placeholder="Enter Wazifa Title"
                    placeholderTextColor="#A9A9A9"
                    value={wazifatitle}
                    onChangeText={setwazifatitle}
                />
            </View>

            <View style={styles.mainasbeehForm}>
                <View style={styles.tasbeehForm}>
                    <View style={styles.tasbeehFormLabels}>
                        <Text style={styles.formLabel}>Wazifa Text</Text>
                        <Text style={styles.formLabel}>Count</Text>
                    </View>

                    <View style={styles.tasbeehFormInputs}>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Enter Wazifa Text"
                            placeholderTextColor="#A9A9A9"
                            keyboardType="default"
                            value={wazifatext}
                            onChangeText={setwazifatext}
                        />
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Enter Count"
                            placeholderTextColor="#A9A9A9"
                            keyboardType="numeric"
                            value={Count}
                            onChangeText={setcount}
                        />
                    </View>
                </View>
                <View style={{ width: "40%" }}>
                    <TouchableOpacity onPress={() => addwazifatext()} style={styles.button}>
                        <Text style={styles.buttonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={data}
                renderItem={({ item, index }) => showdata({ item, index })}
            />

            <View style={{ width: "100%", justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => { CompundWazifadata() }} style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10,
    },
    input: {
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        borderRadius: 100,
    },
    tasbeehForm: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    mainasbeehForm: {
        backgroundColor: colors.tasbeehconatiner || '#f0f0f0',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    tasbeehFormLabels: {
        flex: 1,
    },
    tasbeehFormInputs: {
        flex: 2,
    },
    formLabel: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 34,
    },
    smallInput: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 10,
        color: 'black',
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: "10%",
        borderRadius: 30,
        marginTop: 10,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        marginLeft: 10,
    }
});

export default Craetewazifa;
