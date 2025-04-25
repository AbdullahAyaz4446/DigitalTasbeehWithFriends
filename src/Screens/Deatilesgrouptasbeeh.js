import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../utiles/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { shadow } from 'react-native-paper';


const Deatilesgrouptasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { groupid, Userid, Adminid } = route.params;
    const [showprogress, setshowprogress] = useState(true);
    const [showlog, setshowlog] = useState(false);
    const [adminid, setAdminid] = useState(0); // Add this state

    const handleprogress = () => {
        setshowprogress(true);
        setshowlog(false);
    }
    const handlelogs = () => {
        setshowprogress(false);
        setshowlog(true);
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tasbeeh Group</Text>
            </View>
            <View style={styles.headerbar} >
            {Userid == adminid && (
                    <>
                        <TouchableOpacity>
                            <View style={styles.headeritems}>
                                <AntDesign name="delete" size={40} color="#000" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.headeritems}>
                                <AntDesign name="adduser" size={40} color="#000" />
                            </View>
                        </TouchableOpacity>
                    </>
                )}
                <TouchableOpacity onPress={() => handleprogress()}>
                    <View style={styles.headeritems}>
                        <Image source={require('../Assests/Progress.png')} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlelogs()}>
                    <View style={styles.headeritems}>
                        <Image source={require('../Assests/LOg.png')} />
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                {showprogress && (
                    <Progress
                        groupid={groupid}
                        Userid={Userid}
                        setAdminid={setAdminid} // Pass setter function
                    />
                )}
                {showlog && (
                    <Logs 
                        groupid={groupid}
                        Userid={Userid}
                        adminid={adminid} // Pass the adminid
                    />
                )}
            </View>
        </View>
    )
}

export default Deatilesgrouptasbeeh

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
    headerbar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headeritems: {
        backgroundColor: colors.bar, height: 90, width: 90, justifyContent: 'center', alignItems: 'center', borderRadius: 20
    }, progressContainer: {
        width: '100%',
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',

    },
    progressTextContainer: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    progressText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold'
    },
    progressBar: {
        height: 30,
        width: '70%',
        backgroundColor: '#e0e0e0',
        borderRadius: 40,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 10,
        width: '0%',
    },
    progresscomheader: {
        alignItems: 'center', marginTop: 20
    },
    progresscomheadertext: {
        color: 'black', fontSize: 15, fontWeight: 'bold'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },

    itemText: {
        color: 'black',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    logcontainer: {
        backgroundColor: colors.tasbeehconatiner, marginVertical: 5, borderRadius: 20, padding: 20
    },
    logtext: {
        fontSize: 16, color: 'black', fontWeight: 'bold'
    }

});

const Progress = ({ groupid, Userid, setAdminid  }) => {
    const [groupprogress, setgroupprogress] = useState([]);
    const [progress, setprogress] = useState(0);
    const [Achived, setAchived] = useState(0);
    const [goal, setgoal] = useState(0);
    // const [adminid,setadminid] = useState(0);
    // APi Function to get the group progress
    const Getmembersprogress = async () => {
        try {

            const query = `TasbeehProgressAndMembersProgress?groupid=${encodeURIComponent(groupid)}`;
            const responce = await fetch(Group + query);
            if (responce.ok) {
                const result = await responce.json();
                setgroupprogress(result);
                const percentage = (result[0].Achieved / result[0].TasbeehGoal) * 100;
                setprogress(percentage);
                setAchived(result[0].Achieved);
                setgoal(result[0].TasbeehGoal);
                setAdminid(result[0].Adminid);

            }
            else {
                const result = await responce.text();
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        Getmembersprogress();
    }, []);

    const show = ({ item }) => (
        <View style={styles.rowContainer}>
            <Text style={styles.itemText}>{item.Username}</Text>
            {
                item.Adminid==item.userid?
                    <Text style={[styles.itemText, { color: item.Status?.toLowerCase() === 'online' ? 'green' : 'black' }]}>Admin</Text>
                    :
                    <Text style={[styles.itemText, { color: item.Status?.toLowerCase() === 'online' ? 'green' : 'black' }]}>{item.Status}</Text>
            }

            <Text style={styles.itemText}>{item.AssignCount}/{item.CurrentCount}</Text>
        </View>
    );
    return (
        <View>
            <View style={styles.progresscomheader}>
                <Text style={styles.progresscomheadertext}>
                    Tasbeeh Progress
                </Text>
            </View>
            <View style={styles.progressContainer}>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>{Achived}/{goal}</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[
                        styles.progress,
                        { width: `${progress}%` }
                    ]} />
                </View>
            </View>
            <View style={styles.progresscomheader}>
                <Text style={styles.progresscomheadertext}>
                    Members Progress
                </Text>
            </View>
            <FlatList
                data={groupprogress}
                renderItem={show} />
        </View>
    )
}

// Show log component
const Logs = ({ groupid,Userid ,adminid}) => {
    const [logdata, setlogdata] = useState([]);

    // Tasbeeh Logs ApiFunction
    const Tasbeehlogs = async () => {
        try {
            const query = `Tasbeehlogs?groupid=${encodeURIComponent(groupid)}`;
            const responce = await fetch(Group + query);
            if (responce.ok) {
                const result = await responce.json();
                console.log(result);
                setlogdata(result);
            }
            else {
                const result = await responce.text();
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        Tasbeehlogs();
        console.log(logdata);
    }, [logdata]);

    const show = ({ item }) => (
        <View style={styles.logcontainer}>
            <Text style={styles.logtext}>Title:          {item.title}</Text>
            <Text style={styles.logtext}>Goal:          {item.Goal}</Text>
            <Text style={styles.logtext}>Achieved:   {item.Achieved} </Text>
            <Text style={styles.logtext}>Remaning: {item.Goal - item.Achieved}</Text>
            <View style={{ flexDirection: 'row', justifyContent: item.deadline == null ? 'flex-end' : 'space-between' }}>
                {item.deadline != null && (
                    <Text style={styles.logtext}>DeadLine:  {item.deadline?.split('T')[0] || 'Not set'}</Text>
                )
                }
                {item.status == "Unactive" &&Userid==adminid&& (
                    <TouchableOpacity onPress={async () => {
                        const query = `ActiveTasbeeh?id=${encodeURIComponent(item.id)}`;
                        const responce = await fetch(AssignTasbeh + query);
                        if (responce.ok) {
                            const result = await responce.json();
                            console.log(result);
                            Tasbeehlogs();
                        }
                        else {
                            const result = await responce.text();
                            console.log(result);
                        }
                    }}>
                        <View style={{ backgroundColor: colors.primary, padding: 5, borderRadius: 15 }}>
                            <Text style={[styles.logtext, { color: "white" }]}>Resume</Text>
                        </View>
                    </TouchableOpacity>
                )
                }
            </View>

        </View>
    )
    // Sort the data  function
    // const sortedLogData = [...logdata].sort((a, b) => {
    //     if (a.status === "Active" && b.status !== "Active") return -1;
    //     if (a.status !== "Active" && b.status === "Active") return 1;
    //     return 0;
    // });
    return (
        <View style={{ marginTop: 20 }}>
            <FlatList
                data={logdata}
                renderItem={show}
            />
        </View>
    )
}