import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList, Image
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { SelectList } from 'react-native-dropdown-select-list';


const Craetewazifa = ({ route }) => {
    {/*Varaiables*/ }
    const { Userid } = route.params;
    const [wazifatitle,setwazifatitle]=useState('');
    const [wazifatext,setwazifatext]=useState('');
    const [Count,setcount]=useState('');
    const navigation = useNavigation();

 

    {/*Flate List Function To Show The Data Of Quran Tasbeeh Added */ }
    const showdata = ({ item }) => (
        <View style={{ marginVertical: 10, backgroundColor: colors.tasbeehconatiner, borderRadius: 20 }}>
            <View style={{ margin: 20 }}>
                <Text style={{ color: 'black', fontSize: 16 }}>ID:{item.ID}</Text>
                <Text style={{ color: 'black', fontSize: 16 }}>Surah Name:{item.Sura_name}</Text>
                <Text style={{ color: 'black', fontSize: 14 }}>Text:{item.Ayah_text}</Text>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <TouchableOpacity onPress={() => {
                    deletequrantasbeeh(item.ID);
                }}>
                    <Image source={require('../Assests/trash.png')} style={styles.logo} />
                </TouchableOpacity>
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
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                // data={qurantasbeehdata}
                renderItem={showdata}
            />
            <View style={{ width: "100%" ,justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={() => {
                    Compundtasbeehdata();
                }} style={styles.button}>
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
