import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import { Checkbox } from 'react-native-paper';

const Friends = ({ route }) => {
    const navigation = useNavigation();
    const { groupid, Adminid, selectedItem } = route.params;
    const [data, setdata] = useState([]);
    const [Existinggroupmembers, setExistinggroupmembers] = useState([]);
    const [selectedmembersid, setselectedmembersid] = useState([]);


    // Get All Friends
    const members = async () => {
        try {
            const response = await fetch(url + "Alluser");
            if (response.ok) {
                const data = await response.json();
                setdata(data.filter((item) => item.ID != Adminid));
            } else {
                const errorText = await response.text();
                console.log(errorText);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Get Existing Group Members
    const ExistingGetgroupmembers = async () => {
        try {
            const query = `Allgroupmember?groupid=${encodeURIComponent(groupid || selectedItem.groupid)}`;
            const response = await fetch(url + query);
            if (response.ok) {
                const result = await response.json();
                setExistinggroupmembers(result);
            }
        } catch (error) {
            console.log(error);
        }
    };
    /// handle check box
    const handleCheckboxToggle = (id) => {
        setselectedmembersid((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((memberId) => memberId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };
    // Add member in group api  function

    const Addmemberingroup = async () => {
        try {
            const Compunddata = selectedmembersid.map((memberId) => ({
                Group_id: groupid,
                Members_id: memberId
            }));
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
        } catch (error) {
            console.log(error);
        }
    }
    // Reassign tasbeeh to specfix member
    const reassign = async (id) => {
        const formData = new FormData();
        formData.append("userid", id);
        formData.append("groupid", selectedItem.groupid);
        formData.append("grouptasbeehid", selectedItem.Group_Tasbeeh_id);
        formData.append("adminid", selectedItem.Groupadminid);
        formData.append("assigncount", selectedItem.Assign_count - selectedItem.Current_count);
        formData.append("id", selectedItem.ID);
        const responce = await fetch(AssignTasbeh + 'Reassigntasbeehtospecficmember', {
            method: 'POST',
            body: formData,
        });
        if (responce.ok) {
            navigation.goBack();
        } else {
          console.log("failed to reassign tasbeeh");
        }

    };

    useEffect(() => {
        members();
        ExistingGetgroupmembers();
    }, []);


    

    // Check if a user is already in the group
    const isUserInGroup = (userId) => {
        return Existinggroupmembers.some(member => member.Members_id === userId);
    };

    // Updated card-style render item
    const Show = ({ item }) => (

        <View style={styles.cardContainer} >
            <TouchableOpacity
                disabled={groupid == undefined ? false : true}
                onPress={() => {
                    reassign(item.ID);
                }}
            >
                <View style={styles.cardContent}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={24} color="#fff" />
                    </View>
                    <Text style={styles.cardText}>{item.name}</Text>
                    {isUserInGroup(item.ID) ? (
                        <Text style={styles.alreadyAddedText}>Already Added in group</Text>
                    ) : groupid != undefined ? (
                        <Checkbox
                            status={selectedmembersid.includes(item.ID) ? 'checked' : 'unchecked'}
                            onPress={() => handleCheckboxToggle(item.ID)}
                            color="black" />
                    )
                        :
                        null
                    }
                </View>
            </TouchableOpacity>
        </View>

    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Friends</Text>
            </View>
            <FlatList
                data={data.filter(item => item.ID != Adminid)}
                renderItem={Show}
            />
            {groupid != undefined &&
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => {
                        Addmemberingroup();
                    }} style={styles.button}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};

export default Friends;

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
    listContainer: {
        paddingBottom: 20,
    },
    // Card styles
    cardContainer: {
        backgroundColor: colors.tasbeehconatiner,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        flex: 1,
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
    alreadyAddedText: {
        fontSize: 14,
        color: 'green',
        fontStyle: 'italic',
    }
});