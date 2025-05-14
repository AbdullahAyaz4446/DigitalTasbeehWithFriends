import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Allgrouptasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { groupid,title,Userid,Adminid } = route.params;
    const [logdata, setlogdata] = useState([]);

    const Tasbeehlogs = async () => {
        try {
            const query = `Tasbeehlogs?groupid=${encodeURIComponent(groupid)}`;
            const response = await fetch(Group + query);
            
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setlogdata(result);
            } else {
                const result = await response.text();
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        Tasbeehlogs();
    }, [groupid]);

    const Show = ({ item }) => (
        <TouchableOpacity
        onPress={()=>{
            navigation.navigate("TasbeehGroup",{
                "groupid":groupid,"Userid":Userid,"Adminid":Adminid,"tasbeehid":item.id,"title":title
            })
        }}

        >
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                   {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            <FlatList
                data={logdata}
                renderItem={Show}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No tasbeeh logs found</Text>
                    </View>
                }
            />
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
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    itemContainer: {
        alignItems: 'center',
        padding: 25,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.tasbeehconatiner,
    },
    itemText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        paddingLeft: 10,

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
});

export default Allgrouptasbeeh;