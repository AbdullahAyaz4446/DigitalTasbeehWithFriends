import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';


const Creategroup = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [group, setgroup] = useState([]);
    //Get All Group Function
    const Allgroups = async () => {
        try {
            const query = `GroupTitles?memberId=${encodeURIComponent(Userid)}`;
            const responce = await fetch(url + query);
            if (responce.ok) {
                const data = await responce.json();
                console.log(data);
                setgroup(data);
            }
            else {
                const ans = await responce.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        Allgroups();
    }, [Allgroups]);
    const Show = ({ item }) => (
        <TouchableOpacity onLongPress={() => {
            Alert.alert(
                'Alert',
                'Are you sure you want to delete',
                [
                    { text: 'Cancel' },
                    { text: 'Delete', },
                ]
            );
        }} onPress={() => {
            navigation.navigate('AdminGrouptasbeeh')
        }}>
            <View style={styles.itemContainer}>
                <TouchableOpacity></TouchableOpacity>
                <Text style={styles.itemText}>{item.Grouptitle}</Text>
            </View>
        </TouchableOpacity>

    );
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Groups/Single</Text>
            </View>
            <FlatList
                data={group}
                renderItem={Show}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('CreateGroupSingle', {
                    "Userid": Userid
                })}
                style={styles.fab}
            >
                <Ionicons name="add" size={40} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default Creategroup

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.tasbeehconatiner,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        flex: 1,
        fontSize: 18,
        color: 'black',
    },
    logo: {
        width: 24,
        height: 24,
        marginLeft: 10,
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
    }
});
