import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { SelectList } from 'react-native-dropdown-select-list';
import CalendarPicker from 'react-native-calendar-picker';

const AssignTasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [contributetype, setcontributiontyep] = useState("null");
    const [groupdata, setgroupdata] = useState([]);
    const[groupid,setgroupid]=useState('');
    const[count,setcount]=useState('');


    const selectiontype = [
        { key: '1', value: 'Equally' },
        { key: '2', value: 'Mannully' },
    ];

    // Use useEffect to handle navigation when contributetype changes
    useEffect(() => {
        if (contributetype === 'Mannully') {
            navigation.navigate('Maunnallycontribution');
        }
    }, [contributetype, navigation]);
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
                    }));
            
                setgroupdata(transformedData); 
                console.log(transformedData); 
            } else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        Allgroups();
        console.log(groupid);
    }, [])


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
                            placeholder="Select Tasbeeh"
                            search={false}
                            boxStyles={styles.selectListBox}
                            inputStyles={styles.selectListInput}
                            dropdownStyles={styles.selectListDropdown}
                            dropdownTextStyles={styles.selectListDropdownText}
                            save='value'
                        />
                    </View>
                    <View>
                        <SelectList
                            data={groupdata}
                            setSelected={(value) => {setgroupid(value)}}
                            placeholder="Select Group"
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
                                onDateChange={(date) => console.log(date)}
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
                            onChangeText={(text) => setcount(text)}
                        />
                    </View>
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
                </ScrollView>
                {contributetype === 'Equally' && (
                    <View>
                        <TouchableOpacity  style={styles.button}>
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
    },
    input: {
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        borderRadius: 100,
        color: 'black',
    }
});

export default AssignTasbeeh;