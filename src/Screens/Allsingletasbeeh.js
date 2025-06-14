import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';

const Allsingletasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { tasbeehId, Name } = route.params;
    const [logdata, setlogdata] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deadline, setdeadline] = useState();
    const today = new Date();

    const getlogeddata = async () => {
        try {
            const query = `Getallsingletasbeehlog?id=${encodeURIComponent(tasbeehId)}`;
            const responce = await fetch(Singletasbeeh + query);
            if (responce.ok) {
                const result = await responce.json();
                console.log(result);
                setlogdata(result);
            }
            else {
                const result = await responce.json();

                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const reopentasbeeh = async (id) => {
        try {
            const query = `Opentasbeeh?id=${encodeURIComponent(id)}`;
            const responce = await fetch(Singletasbeeh + query);
            if (responce.ok) {
                const result = await responce.json();
                console.log(result);
                await getlogeddata();
            }
            else {
                const result = await responce.json();
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }



    const reactivateTasbeeh = async (id) => {
        try {
            console.log("reactivateTasbeeh called with id:", id);
            const query = `Reactivesingletasbeeh?id=${encodeURIComponent(id)}&enddate=${encodeURIComponent(deadline)}`;
            const responce = await fetch(Singletasbeeh + query);

            if (responce.ok) {
                const result = await responce.json();
                console.log(result);
                await getlogeddata();
            }
            else {
                const result = await responce.json();
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }


    useFocusEffect(
        React.useCallback(() => {
            getlogeddata();
        }, [])
    );
    useEffect(() => {
        getlogeddata();
    }, [tasbeehId]);

    // handle date time
    const handleDateChange = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;
        setdeadline(formattedDate);
    };


    const Show = ({ item }) => (
        <TouchableOpacity
            disabled={item.Flag === 1 || item.Flag === 2}
            onPress={() => {
                navigation.navigate("Singletasbeeh", {
                    "tasbeehId": tasbeehId, "Name":item.title, "astid": item.ID, "tid": item.tid
                })
            }}

            style={styles.cardContainer}
        >
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                        {item.title}
                    </Text>
                    {(item.Flag != 0) && (
                        <View style={[
                            styles.statusBadge,
                            item.Flag ==1 ? styles.closedBadge : styles.completedBadge
                        ]}>
                            <Text style={styles.statusText}>
                                {item.Flag ==1 ? "Closed" : "Completed"}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressInfo}>
                            <Text style={styles.progressLabel}>Goal:</Text>
                            <Text style={styles.progressValue}>{item.Goal}</Text>
                        </View>
                        <View style={styles.progressInfo}>
                            <Text style={styles.progressLabel}>Achieved:</Text>
                            <Text style={styles.progressValue}>{item.Achieved}</Text>
                        </View>
                        <View style={styles.progressInfo}>
                            <Text style={styles.progressLabel}>Remaining:</Text>
                            <Text style={styles.progressValue}>{item.Goal - item.Achieved}</Text>
                        </View>
                    </View>

                    {item?.deadline && (
                        <View style={styles.deadlineContainer}>
                            <Ionicons name="calendar" size={16} color="#666" />
                            <Text style={styles.deadlineText}>
                                Deadline: {item.deadline.split('T')[0]}
                            </Text>
                        </View>
                    )}
                </View>

                {(item.Flag != 0) &&
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                item.Flag == 1 ? styles.reopenButton : styles.reactivateButton
                            ]}
                            onPress={() => {
                                item.Flag === 1 ?
                                    reopentasbeeh(item.ID)
                                    :
                                    item.deadline == today ?
                                        setShowModal(true)
                                        :
                                        reactivateTasbeeh(item.ID

                                        );
                            }
                            }
                        >
                            <Text style={styles.buttonText}>
                                {item.Flag == 1 ? 'Reopen' : 'Reactivate'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>



            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{Name}</Text>
            </View>

            <FlatList
                data={logdata}
                renderItem={Show}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 18 }}>No tasbeeh Assign yet</Text>
                    </View>
                }
            />

            {/* Delete Confirmation Modal */}
            <Modal transparent visible={showModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmationCard}>
                        <Text style={styles.confirmationTitle}>Select new Deadline</Text>
                        <View style={styles.calendarContainer}>
                            <View style={styles.calendarWrapper}>
                                <CalendarPicker
                                    onDateChange={(date) => handleDateChange(date)}
                                    minDate={new Date()}
                                    previousComponent={null}
                                />
                            </View>
                        </View>
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={[styles.confirmationButton, styles.cancelButton]}
                            >
                                <Text style={styles.confirmationButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.confirmationButton, styles.deleteButton]}
                            >
                                <Text style={styles.confirmationButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    button: {
        backgroundColor: "#1C368E",
        paddingVertical: 5,
        paddingHorizontal: "10%",
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    cardContainer: {
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: "#1C368E",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    closedBadge: {
        backgroundColor: '#ff6b6b',
    },
    completedBadge: {
        backgroundColor: '#51cf66',
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardBody: {
        padding: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    progressInfo: {
        alignItems: 'center',
    },
    progressLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    progressValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    deadlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    deadlineText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    reopenButton: {
        backgroundColor: '#ff6b6b',
    },
    reactivateButton: {
        backgroundColor: '#51cf66',
    },
});


export default Allsingletasbeeh;