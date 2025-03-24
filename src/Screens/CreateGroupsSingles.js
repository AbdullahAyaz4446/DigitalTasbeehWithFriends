import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    Alert,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { SelectList } from 'react-native-dropdown-select-list';
import { Checkbox } from 'react-native-paper';

const CreateGroupSingle = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [grouptitle, setgrouptitle] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [members, setmembers] = useState([]);
    const [selectedmembersid, setselectedmembersid] = useState([]);

    const selectiontype = [
        { key: '1', value: 'Single' },
        { key: '2', value: 'Group' },
    ];

    // Get All Members Function
    const Selectmembers = async () => {
        try {
            const response = await fetch(url + "Alluser");
            if (response.ok) {
                const data = await response.json();
                setmembers(data);
                console.log(data);
            } else {
                const errorText = await response.text();
                console.log(errorText);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Handle Checkbox Toggle
    const handleCheckboxToggle = (id) => {
        setselectedmembersid((prevSelected) => {
            if (prevSelected.includes(id)) {
                // If already selected, remove it
                return prevSelected.filter((memberId) => memberId !== id);
            } else {
             
                return [...prevSelected, id];
            }
        });
    };
    // //Create Single Fuunction
    const CreateSingle = async () => {
        try {
            const obj={
                Title:grouptitle,
                User_id:Userid
            }
            const responce=await fetch(Singletasbeeh+"CreateSingletasbeeh",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(obj),
            });
            if(responce.ok){
                const data=await responce.text();
                console.log(data);
                navigation.goBack();
            }else{
                const errorText=await responce.text();
                console.log("Error creating Single:",errorText);
            }
        } catch (error) {
            console.log(error);
        }

    }
    // Create Group Function    
    const CreateGroup = async () => {
        try {
            if (grouptitle === '') {
                Alert.alert(
                    "Title Required",
                    "Please enter group title",
                    [
                        {
                            text: "OK",
                            onPress: () => console.log("OK Pressed"),
                            style: "default",
                        },
                    ],
                    { cancelable: false }
                );
            }
            if (selectedmembersid.length > 0) {
                const obj = {
                    Group_Title: grouptitle,
                    Admin_id: Userid,
                };
                console.log("Creating group with payload:", obj);

                const response = await fetch(Group + "CreateGroup", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Group created with ID:", data.ID);
                    const userobj = { Group_id: data.ID, Members_id: Userid };
                    const Compunddata = selectedmembersid.map((memberId) => ({
                        Group_id: data.ID,
                        Members_id: memberId
                    }));
                    Compunddata.push(userobj);
                    console.log("Inserting group members with payload:", Compunddata);
                    const responce = await fetch(Group + "GroupMembers", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(Compunddata),
                    });

                    if (responce.ok) {
                        const ans = await responce.json();
                        console.log("Members inserted successfully:", ans);
                        navigation.goBack();
                    } else {
                        const ans = await responce.text();
                        console.log("Error inserting members:", ans);
                    }
                } else {
                    const errorText = await response.text();
                    console.log("Error creating group:", errorText);
                }
            } else {
                Alert.alert(
                    "Selection Required",
                    "Please select members",
                    [
                        {
                            text: "OK",
                            onPress: () => console.log("OK Pressed"),
                            style: "default",
                        },
                    ],
                    { cancelable: false }
                );
            }

        } catch (error) {
            console.log("An error occurred:", error);
        }
    };
    // Refreshing the selected members arry
    useEffect(() => {
        console.log(selectedmembersid);
    }, [selectedmembersid])
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Group/Single</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter Group Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter group Title"
                        placeholderTextColor="#A9A9A9"
                        value={grouptitle}
                        onChangeText={setgrouptitle}
                    />
                </View>

                <SelectList
                    data={selectiontype}
                    setSelected={(value) => {
                        setSelectedType(value);
                        if (value === 'Group') {
                            Selectmembers();
                        }
                    }}
                    placeholder="Type"
                    search={false}
                    boxStyles={styles.selectListBox}
                    inputStyles={styles.selectListInput}
                    dropdownStyles={styles.selectListDropdown}
                    dropdownTextStyles={styles.selectListDropdownText}
                    save='value'
                />

                {selectedType === 'Group' && (
                    <View style={styles.onselectgroupdata}>
                        <Text style={styles.selectMembersTitle}>Select Members</Text>
                        <FlatList
                            data={members.filter((member) => member.ID !== Userid)}
                            renderItem={({ item }) => (
                                <View style={styles.memberItem}>
                                    <View style={styles.memberNameContainer}>
                                        <Text style={styles.memberName}>{item.name}</Text>
                                    </View>
                                    <View style={styles.memberStatusContainer}>
                                        <Text style={[styles.memberStatus, { color: item.Status === 'online' || item.Status === 'Online' ? 'green' : 'black' }]}>{item.Status}</Text>
                                    </View>
                                    <View style={styles.checkboxContainer}>
                                        <Checkbox
                                            status={selectedmembersid.includes(item.ID) ? 'checked' : 'unchecked'}
                                            onPress={() => handleCheckboxToggle(item.ID)}
                                        />
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item) => item.ID}
                        />
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={selectedType=='Single'?CreateSingle:CreateGroup} style={styles.button}>
                    <Text style={styles.buttonText}>Create</Text>
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
        color: 'black',
    },
    selectListBox: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10,
    },
    selectListInput: {
        color: 'black',
        fontWeight: 'bold',
    },
    selectListDropdown: {
        backgroundColor: 'white',
    },
    selectListDropdownText: {
        color: 'black',
        fontWeight: 'bold',
    },
    onselectgroupdata: {
        margin: 20,
    },
    selectMembersTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: '#ECECEC',
        padding: 10,
        borderRadius: 20,
    },
    memberItem: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
    },
    memberNameContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    memberName: {
        color: 'black',
        fontWeight: 'bold',
    },
    memberStatusContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    memberStatus: {
        color: 'black',
    },
    checkboxContainer: {
        justifyContent: 'center',
    },
    footer: {
        width: '100%',
        justifyContent: 'flex-end',
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

export default CreateGroupSingle;