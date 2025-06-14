import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { SelectList } from 'react-native-dropdown-select-list';
import CalendarPicker from 'react-native-calendar-picker';

const AssignTasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [contributetype, setcontributiontyep] = useState("null");
    const [groupid, setgroupid] = useState('');
    const [count, setcount] = useState('');
    const [deadline, setdeadline] = useState('');
    const [tasbeeh, settasbeeh] = useState([]);
    const [tasbeehid, settasbeehid] = useState();
    const [selectedtype, setSelectedType] = useState();
    const [groups, setGroups] = useState([]); // Only for groups
    const [single, setsingle] = useState([]); // Only for single tasbeeh
    const [combinedData, setCombinedData] = useState([]); // Combined when needed
    const [day, setday] = useState('');
   


    const selectiontype = [
        { key: '1', value: 'Equally' },
        { key: '2', value: 'Mannully' },
    ];

    const days = [
        { key: '0', value: 'Sunday' },
        { key: '1', value: 'Monday' },
        { key: '2', value: 'Tuesday' },
        { key: '3', value: 'Wednesday' },
        { key: '4', value: 'Thusday' },
        { key: '5', value: 'Friday' },
        { key: '6', value: 'Saturady' }
    ];


    // Use useEffect to handle navigation when contributetype changes
    useEffect(() => {
        if (contributetype === 'Mannully') {

            navigation.navigate('Maunnallycontribution', {
                "groupid": groupid,
                "Userid": Userid,
                "Tasbeeh_id": tasbeehid.substring(2),
                "Goal": count,
                "End_date": deadline
            });
         
        }
    }, [contributetype, navigation]);


    // for load all groups and all  tasbeeh in the screen load
    useEffect(() => {
        settasbeeh([]);
        Alltasbeeh();
        Allgroups();
        AllSingle();
    }, [deadline]);
    // Combile the data from groups and single
    useEffect(() => {
        const combined = [...groups, ...single];
        setCombinedData(combined);
    }, [groups, single]);


    // Get All Single Tasbeeh Api Function
    const AllSingle = async () => {
        try {
            const query = `GetAllSingletasbeehbyid?userid=${encodeURIComponent(Userid)}`;
            const response = await fetch(Singletasbeeh + query);
            if (response.ok) {
                const data = await response.json();
                const transformedData = data
                    .map((item) => ({
                        key: item.ID,
                        value: item.Title,
                        groupid: item.ID,
                        Adminid: item.User_id,
                        type: 'Single'
                    }));
                setsingle(transformedData);

            }
            else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //Get Group Title Api Function
    const Allgroups = async () => {
        try {
            const query = `GroupTitles?memberId=${encodeURIComponent(Userid)}`;
            const response = await fetch(url + query);
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                const transformedData = data
                    .filter((item) => item.Adminid == Userid)
                    .map((item) => ({
                        key: item.Groupid,
                        value: item.Grouptitle,
                        groupid: item.Groupid,
                        Adminid: item.Adminid,
                        type: 'group'
                    }));
                setGroups(transformedData);

                console.log(transformedData);
            } else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    };


    {/*All Tasbeeh Api Function*/ }
    const Alltasbeeh = async () => {
        try {
            const query = `Alltasbeeh?userid=${encodeURIComponent(Userid)}`;
            const response = await fetch(tasbeehurl + query);

            if (response.ok) {
                const data = await response.json();
                const transformedData = data.map((item) => ({
                    key: `t-${item.ID}`,
                    value: `${item.Tasbeeh_Title} (${item.Type})`,
                }));
                settasbeeh(transformedData);
                console.log(data);
            } else {
                console.error('Failed to fetch tasbeeh:', response.status);
                Alert.alert('Error', 'Failed to load tasbeeh. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching tasbeeh:', error);
            Alert.alert('Error', 'Something went wrong. Please check your network.');
        }
    };

    // Assign Tasbeeh Api Function
    const Assigntasbeeh = async () => {

        if (selectedtype === "Single") {
            try {

                const tasbeehobject = {
                    SingleTasbeeh_id: groupid,
                    Tasbeeh_id: tasbeehid.substring(2),
                    Goal: parseInt(count, 10),
                    Enddate: deadline,
                    schedule: day
                }
                console.log("Final API Payload:", tasbeehobject);
                const responce = await fetch(Singletasbeeh + 'Assigntosingletasbeeh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tasbeehobject),
                });
                if (responce.ok) {
                    const ans = await responce.json();
                    console.log(ans);
                    navigation.goBack();

                }
                else {
                    const ans = await responce.text();
                    console.log(ans);
                }

            } catch (error) {
                console.log(error);
            }
        }
        else {
            const AssignTasbeehobj = {
                Group_id: groupid,
                Tasbeeh_id: tasbeehid.substring(2),
                Goal: parseInt(count, 10),
                End_date: deadline,
                schedule: day,
            };

            console.log("Final API Payload:", AssignTasbeehobj);
            try {
                if (contributetype === 'Equally') {
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
                        console.log(ans);
                        DistributeTasbeehEqually(ans.ID);
                        navigation.goBack();
                    } else {
                        const ans = await response.text();
                        console.log(ans);
                    }
                }
                
                else {
                    Alert.alert(
                        'Alert',
                        'Please Select Contribution Type',
                        [
                            { text: 'Cancel' },
                            { text: 'Delete', },
                        ]
                    );
                }

            } catch (error) {
                console.log(error.message);
            }
        }

    };

    // Equally Contribution  Api Function\
    const DistributeTasbeehEqually = async (id) => {
        try {

            console.log("Group ID:", id);
            const Query = `DistributeTasbeehEqually?groupid=${encodeURIComponent(groupid)}&tasbeehid=${encodeURIComponent(id)}`;
            console.log(Query);
            const response = await fetch(SendRequest + Query, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            if (response.ok) {
                const ans = await response.json();
                console.log(ans);

            } else {
                const ans = await response.json();
                console.log(ans);
            }

        } catch (error) {
            console.log(error);

        }
    }

    // handle date time
    const handleDateChange = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;
        setdeadline(formattedDate);
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Assign Tasbeeh</Text>
                </View>
                <ScrollView>
                    <View>
                        <SelectList
                            data={tasbeeh}
                            setSelected={(value) => { settasbeehid(value) }}
                            placeholder="Select Tasbeeh"
                            search={false}
                            boxStyles={styles.selectListBox}
                            inputStyles={styles.selectListInput}
                            dropdownStyles={styles.selectListDropdown}
                            dropdownTextStyles={styles.selectListDropdownText}
                            save='key'
                        />
                    </View>
                    <View>
                        <SelectList
                            data={combinedData}
                            setSelected={(value) => {
                                setgroupid(value);
                                const selected = combinedData.find(item => item.key === value);
                                setSelectedType(selected.type);
                            }}
                            placeholder="Select Group/Single"
                            search={false}
                            boxStyles={styles.selectListBox}
                            inputStyles={styles.selectListInput}
                            dropdownStyles={styles.selectListDropdown}
                            dropdownTextStyles={styles.selectListDropdownText}
                            save='key'
                        />
                    </View>
                    <View>
                        <SelectList
                            data={days}
                            setSelected={(value) => { setday(value) }}
                            placeholder="Select Day"
                            search={false}
                            boxStyles={styles.selectListBox}
                            inputStyles={styles.selectListInput}
                            dropdownStyles={styles.selectListDropdown}
                            dropdownTextStyles={styles.selectListDropdownText}
                            save='key'
                        />
                    </View>
                    <View style={styles.calenderheader}>
                        <Text style={styles.headertext}>Enter DeadLine Date</Text>
                    </View>

                    <View style={styles.calendarContainer}>
                        <View style={styles.calendarWrapper}>
                            <CalendarPicker
                                onDateChange={(date) => handleDateChange(date)}
                                minDate={new Date()}
                                previousComponent={null}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Enter Count</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter group Title"
                            placeholderTextColor="#A9A9A9"
                            value={count}
                            keyboardType='numeric'
                            onChangeText={(text) => setcount(text)}
                        />
                    </View>
                    {selectedtype === 'group' &&
                        <View>
                            <SelectList
                                placeholder="Distribution Type"
                                data={selectiontype}
                                setSelected={(value) => {
                                    setcontributiontyep(value);
                                }}
                                search={false}
                                boxStyles={styles.selectListBox}
                                inputStyles={styles.selectListInput}
                                dropdownStyles={styles.selectListDropdown}
                                dropdownTextStyles={styles.selectListDropdownText}
                                save='value'

                            />
                        </View>
                    }
                </ScrollView>

                {contributetype == 'Equally' ? <View>
                    <TouchableOpacity onPress={Assigntasbeeh} style={styles.button}>
                        <Text style={styles.buttonText}>Assign</Text>
                    </TouchableOpacity>
                </View> : selectedtype == "Single" && (
                    <View>
                        <TouchableOpacity onPress={Assigntasbeeh} style={styles.button}>
                            <Text style={styles.buttonText}>Assign</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    calendarContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarWrapper: {
        transform: [{ scale: 0.9 }],
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
    calenderheader: {
        alignItems: 'center',
    },
    headertext: {
        fontWeight: 'bold', color: 'black', fontSize: 17
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 25,
        color: 'black',
        backgroundColor: 'white',
    }
});

export default AssignTasbeeh;