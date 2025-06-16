import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { AppState } from 'react-native';
import { colors } from '../utiles/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';


const Deatilesgrouptasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { groupid, Userid, Adminid, tasbeehid,title} = route.params;
    const [showprogress, setshowprogress] = useState(true);
    useEffect(() => {
     console.log(title);
    }
    , []);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            <View>
                {showprogress && (
                    <Progress
                        groupid={groupid}
                        Userid={Userid}
                        tasbeehid={tasbeehid}
                        Adminid={Adminid}
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
        justifyContent: 'space-around'
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
        backgroundColor: colors.tasbeehconatiner,
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        paddingVertical: 20
    },

    itemText: {
        color: 'black',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    logcontainer: {
        backgroundColor: colors.tasbeehconatiner, marginVertical: 5, borderRadius: 20, padding: 20
    },
    logtext: {
        fontSize: 16, color: 'black', fontWeight: 'bold'
    }

});

const Progress = ({ groupid, Userid, tasbeehid, Adminid }) => {
    const [groupprogress, setgroupprogress] = useState([]);
    const [progress, setprogress] = useState(0);
    const [Achived, setAchived] = useState(0);
    const [goal, setgoal] = useState(0);
    const [isOnline, setIsOnline] = useState(true);



    // APi Function to get the group progress
    const Getmembersprogress = async () => {
        try {
            const query = `TasbeehProgressAndMembersProgress?groupid=${encodeURIComponent(groupid)}&tasbeehid=${encodeURIComponent(tasbeehid)}`;
            const responce = await fetch(Group + query);
            if (responce.ok) {
                const result = await responce.json();
                console.log(result);
                setgroupprogress(result);
                const percentage = (result[0].Achieved / result[0].TasbeehGoal) * 100;
                setprogress(percentage);
                setAchived(result[0].Achieved);
                setgoal(result[0].TasbeehGoal);


            }
            else {
                const result = await responce.text();
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Get online Function
    const checkOnlineStatus = async () => {
        try {
            const query = `Online?ID=${encodeURIComponent(Userid)}`;
            const response = await fetch(url + query);
            const isCurrentlyOnline = response.ok;
            setIsOnline(isCurrentlyOnline);
            await updateOnlineStatus(isCurrentlyOnline);
            return isCurrentlyOnline;
        } catch (error) {
            setIsOnline(false);
            await updateOnlineStatus(false);
            return false;
        }
    };
    //  update state
    const updateOnlineStatus = async (status) => {
        try {
            const statusParam = status ? 'online' : 'offline';
            const query = `UpdateOnlineStatus?UserID=${encodeURIComponent(Userid)}&Status=${encodeURIComponent(statusParam)}`;

            const response = await fetch(url + query, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            return await response.json();
        } catch (error) {
            console.error('Status update error:', error);
            throw error;
        }
    };


    // Improved AppState and interval management and online show 
    useEffect(() => {
        let isMounted = true;
        let intervalId;

        const handleAppStateChange = async (nextAppState) => {
            if (!isMounted) return;

            if (nextAppState === 'active') {

                await checkOnlineStatus();
            } else {

                await updateOnlineStatus(false);
            }
        };

        // Initial status check
        checkOnlineStatus();

        const setupInterval = () => {
            intervalId = setInterval(async () => {
                if (AppState.currentState === 'active') {
                    await checkOnlineStatus();
                }
            }, 15000);
        };
        setupInterval();
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            isMounted = false;
            clearInterval(intervalId);
            subscription?.remove();
            updateOnlineStatus(false).catch(console.error);
        };
    }, [Userid]);


    useEffect(() => {
        Getmembersprogress();

    }, []);

    const show = ({ item }) => (
        <View style={styles.rowContainer}>
            {
                "online" == "online" ? (
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'green',
                        }}
                    />
                ) : (
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#333333',
                        }}
                    />
                )
            }

            <Text style={styles.itemText}>{item.Username}</Text>


            <Text style={styles.itemText}>{item.CurrentCount}/{item.AssignCount}</Text>

            {item.Adminid == item.userid ? (
                <Text style={[styles.itemText, { color: 'green' }]}>Admin</Text>
            ) : item.userid == Userid ? (
                <Text style={[styles.itemText, { color: 'black' }]}>You</Text>
            ) : (
                <Text style={[styles.itemText, { color: 'black' }]}>Member</Text>
            )}
        </View>
    );



    // // Sort the data  to show you data on top function
    // const sortedLogData = [...logdata].sort((a, b) => {
    //     if (a.status === "Active" && b.status !== "Active") return -1;
    //     if (a.status !== "Active" && b.status === "Active") return 1;
    //     return 0;
    // });
    return (
        <View>
            <View style={styles.progresscomheader}>
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