import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';

const Allschedulestasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { groupid, Userid, Adminid } = route.params;
    const [logdata, setlogdata] = useState([]);
    const [scheduledTasbeeh, setScheduledTasbeeh] = useState([]);
    const [showDayModal, setShowDayModal] = useState(false);
    const [selectedTasbeeh, setSelectedTasbeeh] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showModald, setShowModald] = useState(false);
    const [id, setid] = useState();
    const today = new Date();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const Tasbeehlogs = async () => {
        try {
            const query = `Tasbeehlogs?groupid=${encodeURIComponent(groupid)}&userid=${encodeURIComponent(Userid)}`;
            const response = await fetch(Group + query);

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setlogdata(result);
                const scheduled = result.filter(item => item.day !== null);
                setScheduledTasbeeh(scheduled);
            } else {
                const result = await response.text();
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // delete tasbeeh api function
    const deletetasbeeh = async (id) => {
        try {
            const query = `Deletetasbeehingroup?id=${encodeURIComponent(id)}`;
            const response = await fetch(AssignTasbeh + query);
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setShowModald(false);
                await Tasbeehlogs();
            } else {
                const result = await response.text();
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // update date api function
    const updatetasbeehday = async () => {
        try {
            if (selectedTasbeeh && selectedDay !== null) {
                const query = `updateday?id=${encodeURIComponent(id)}&day=${encodeURIComponent(selectedDay)}`;
                const response = await fetch(Group + query);
                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    setShowDayModal(false);
                    await Tasbeehlogs();
                } else {
                    const result = await response.text();
                    console.log(result);
                }
            } else {
                console.log("Selected tasbeeh or day is not set");
            }


        }catch (error) {
            console.error(error);   
        }
    };



    useEffect(() => {
        Tasbeehlogs();
    }, [groupid]);

    const getDayName = (dayNumber) => {
        return days[dayNumber] || 'Unknown day';
    };

    const Show = ({ item }) => (
        <TouchableOpacity
            disabled={item.Flag === 1 || item.Flag === 2}
             onLongPress={() => { setid(item.id), setShowModald(true) }}
            style={styles.cardContainer}
        >

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                        {item.title}
                    </Text>
                    {(item.Flag !== 0) && (
                        <View style={[
                            styles.statusBadge,
                            item.Flag === 1 ? styles.closedBadge : styles.completedBadge
                        ]}>
                            <Text style={styles.statusText}>
                                {item.Flag === 1 ? "Closed" : "Completed"}
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

                    <View style={styles.dayContainer}>
                        <Ionicons name="time" size={16} color="#666" />
                        <Text style={styles.dayText}>
                            Scheduled on: {getDayName(item.day)}
                        </Text>
                        {Adminid === Userid && (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => {
                                    setSelectedTasbeeh(item);
                                    setSelectedDay(item.day);
                                    setid(item.id);
                                    setShowDayModal(true);
                                }}
                            >
                                <Ionicons name="create-outline" size={16} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scheduled Tasbeeh</Text>
            </View>

            <FlatList
                data={scheduledTasbeeh}
                renderItem={Show}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 18 }}>No scheduled tasbeeh found</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />


            <Modal transparent visible={showDayModal} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowDayModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Day</Text>

                            {days.map((day, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dayOption,
                                        selectedDay === index && styles.selectedDayOption
                                    ]}
                                    onPress={() => setSelectedDay(index)}
                                >
                                    <Text style={selectedDay === index ? styles.selectedDayText : styles.dayText}>
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowDayModal(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                onPress={updatetasbeehday}
                                >
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal transparent visible={showModald} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowModald(false)}>
                    <View style={styles.deleteModalOverlay}>
                        <View style={styles.deleteModalContent}>
                            <Text style={styles.deleteModalTitle}>
                                Do You Want to Delete this Schedule tasbeeh
                            </Text>
                            <View style={styles.deleteModalButtons}>
                                <TouchableOpacity
                                    onPress={() => setShowModald(false)}
                                    style={styles.deleteModalCancelButton}>
                                    <Text style={styles.deleteModalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        deletetasbeeh(id);
                                        setShowModald(false);
                                    }}
                                    style={styles.deleteModalDeleteButton}>
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
    dayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    dayText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    editButton: {
        marginLeft: 'auto',
        padding: 4,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '80%',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    dayOption: {
        padding: 12,
        marginVertical: 4,
        borderRadius: 6,
    },
    selectedDayOption: {
        backgroundColor: '#1C368E',
    },
    selectedDayText: {
        color: 'white',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#1C368E',
        padding: 12,
        borderRadius: 6,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    // Delete Confirmation Modal (second modal)
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
        backgroundColor: "#92A5E3",
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

export default Allschedulestasbeeh;