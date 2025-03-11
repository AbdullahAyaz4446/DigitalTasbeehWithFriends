import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Maunnallycontribution = () => {
    const navigation = useNavigation();
    const data = [
        { name: 'Abdullah Ayaz' },
        { name: 'Tuheed Ayaz' }
    ];

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Roommates</Text>
                </View>
                <View>
                    <Text style={[styles.headerTitle, { flex: 0 }]}>Group Members:</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.headerTitle, { flex: 0 }]}>Group Members Details</Text>
                </View>

                <FlatList
                    data={data}

                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <View style={styles.inputButtonContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Count"
                                    placeholderTextColor="#A9A9A9"
                                />
                                {/* <TouchableOpacity style={{
                                    backgroundColor: 'red',
                                    paddingVertical: 15,
                                    paddingHorizontal: 20,
                                    borderRadius: 30,
                                }}>
                                    <Text style={{
                                        color: colors.white,
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        textAlign: 'center',
                                    }}>Assign</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    )}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Assign</Text>
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
    itemContainer: {
        width: '100%',
        marginVertical: 10,

    },
    itemText: {
        color: 'black',
        fontSize: 18,
        paddingLeft: 10
    },
    inputButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
        borderRadius: 100,
        color: 'black',
        flex: 1,
        marginRight: 10,
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

export default Maunnallycontribution;