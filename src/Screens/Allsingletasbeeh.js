import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';

const Allsingletasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { tasbeehId, Name } = route.params;
    const [logdata, setlogdata] = useState([]);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
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
                setShowCalendarModal(false);
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

    const deleteTasbeeh = async (id) => {
        try {
            const query = `delete?id=${encodeURIComponent(id)}`;
            const responce = await fetch(Singletasbeeh + query);
            if (responce.ok) {
                const result = await responce.json();
                console.log(result);
                setShowDeleteModal(false);
            }
            else {
                const result = await responce.json();
                console.log(result);
            }
            await getlogeddata();
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
                    "tasbeehId": tasbeehId, "Name": item.title, "astid": item.ID, "tid": item.tid
                })
            }}
            onLongPress={() => {
                setSelectedItemId(item.ID);
                setShowDeleteModal(true);
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
                            item.Flag == 1 ? styles.closedBadge : styles.completedBadge
                        ]}>
                            <Text style={styles.statusText}>
                                {item.Flag == 1 ? "Closed" : "Completed"}
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
                                        setShowCalendarModal(true)
                                        :
                                        reactivateTasbeeh(item.ID);
                                setSelectedItemId(item.ID);
                            }}
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

            {/* Calendar Modal for Reactivation */}
            <Modal transparent visible={showCalendarModal} animationType="fade">
                <View style={styles.calendarModalOverlay}>
                    <View style={styles.calendarModalCard}>
                        <Text style={styles.calendarModalTitle}>Select new Deadline</Text>
                        <View style={styles.calendarContainer}>
                            <View style={styles.calendarWrapper}>
                                <CalendarPicker
                                    onDateChange={(date) => handleDateChange(date)}
                                    minDate={new Date()}
                                    previousComponent={null}
                                />
                            </View>
                        </View>
                        <View style={styles.calendarModalButtons}>
                            <TouchableOpacity
                                onPress={() => setShowCalendarModal(false)}
                                style={[styles.calendarModalButton, styles.calendarModalCancelButton]}
                            >
                                <Text style={styles.calendarModalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.calendarModalButton, styles.calendarModalSubmitButton]}
                                onPress={() => reactivateTasbeeh(selectedItemId)}
                            >
                                <Text style={styles.calendarModalButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal transparent visible={showDeleteModal} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
                    <View style={styles.deleteModalOverlay}>
                        <View style={styles.deleteModalContent}>
                            <Text style={styles.deleteModalTitle}>
                                Do You Want to Delete this tasbeeh?
                            </Text>
                            <View style={styles.deleteModalButtons}>
                                <TouchableOpacity
                                    onPress={() => setShowDeleteModal(false)}
                                    style={styles.deleteModalCancelButton}
                                >
                                    <Text style={styles.deleteModalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteTasbeeh(selectedItemId)}
                                    style={styles.deleteModalDeleteButton}
                                >
                                    <Text style={styles.deleteModalButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
    // Calendar Modal Styles
    calendarModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    calendarModalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '90%',
        padding: 20,
    },
    calendarModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    calendarContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarWrapper: {
        transform: [{ scale: 0.9 }],
    },
    calendarModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    calendarModalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    calendarModalCancelButton: {
        backgroundColor: '#e0e0e0',
        marginRight: 8,
    },
    calendarModalSubmitButton: {
        backgroundColor: '#51cf66',
        marginLeft: 8,
    },
    calendarModalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    // Delete Modal Styles
    deleteModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    deleteModalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 20,
        width: '90%',
    },
    deleteModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
        color: 'black',
    },
    deleteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteModalCancelButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 10,
        width: '48%',
    },
    deleteModalDeleteButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 10,
        width: '48%',
    },
    deleteModalButtonText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default Allsingletasbeeh;