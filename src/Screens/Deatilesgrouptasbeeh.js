import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../utiles/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { shadow } from 'react-native-paper';


const Deatilesgrouptasbeeh = () => {
    const navigation = useNavigation();
    const [showprogress, setshowprogress] = useState(true);
    const [showlog, setshowlog] = useState(false);

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
                {showprogress && <Progress />}
                {showlog && <Logs />}
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

const Progress = () => {
    const members = [
        { id: '1', name: 'Abdullah', status: 'online', goal: '20/30' },
        { id: '2', name: 'Amna Ejaz', status: 'offline', goal: '15/30' },
        { id: '3', name: 'Huzifa', status: 'online', goal: '30/30' },
        { id: '4', name: 'Ramish Wazir', status: 'ofline', goal: '10/30' },
        { id: '5', name: 'AbdulQadoos Ch', status: 'online', goal: '25/30' },
    ];

    const show = ({ item }) => (
        <View style={styles.rowContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={[styles.itemText, { color: item.status?.toLowerCase() === 'online' ? 'green' : 'black' }]}>{item.status}</Text>
            <Text style={styles.itemText}>{item.goal}</Text>
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
                    <Text style={styles.progressText}>20/30</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: "50%" }]} />
                </View>
            </View>
            <View style={styles.progresscomheader}>
                <Text style={styles.progresscomheadertext}>
                    Members Progress
                </Text>
            </View>
            <FlatList
                data={members}
                renderItem={show} />
        </View>
    )
}
const Logs = () => {
    const logdata = [
        {
            id: "1",
            title: "Dua of success",
            Goal: "100",
            remaning: "50",
            Achived: 50,
            deadline: "2025-04-25"
        },
        {
            id: "2",
            title: "Forgiveness Tasbeeh",
            Goal: "200",
            remaning: "120",
            Achived: 80,
            deadline: "2025-04-30"
        },
        {
            id: "3",
            title: "Peace and Patience",
            Goal: "150",
            remaning: "50",
            Achived: 100,
            deadline: "2025-05-10"
        }
    ];
    const show = ({ item }) => (
        <View style={styles.logcontainer}>
            <Text style={styles.logtext}>Title:          {item.title}</Text>
            <Text style={styles.logtext}>Goal:          {item.Goal}</Text>
            <Text style={styles.logtext}>Achived:    {item.remaning}</Text>
            <Text style={styles.logtext}>Remaning: {item.Achived}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.logtext}>DeadLine:  {item.deadline}</Text>
                <TouchableOpacity>
                    <View style={{ backgroundColor:colors.primary,padding:5,borderRadius:15 }}>
                        <Text style={[styles.logtext,{color:"white"}]}>Resume</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </View>
    )

    return (
        <View style={{ marginTop: 20 }}>
            <FlatList
                data={logdata}
                renderItem={show}
            />
        </View>
    )
}