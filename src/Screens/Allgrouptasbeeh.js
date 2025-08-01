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
import { colors } from '../utiles/colors';
import CalendarPicker from 'react-native-calendar-picker';

const Allgrouptasbeeh = ({ route }) => {
    const navigation = useNavigation();
    const { groupid, title, Userid, Adminid } = route.params;
    const [logdata, setlogdata] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModald, setShowModald] = useState(false);
    const [deadline, setdeadline] = useState();
    const [id, setid] = useState();
    const [showOptions, setShowOptions] = useState(false);
    const [modalAction, setModalAction] = useState('');


    const today = new Date();


    const Tasbeehlogs = async () => {
        try {
            const query = `Tasbeehlogs?groupid=${encodeURIComponent(groupid)}&userid=${encodeURIComponent(Userid)}`;
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

    const reopentasbeeh = async (id) => {
        try {
            const query = `Opentasbeeh?id=${encodeURI(id)}`;
            const responce = await fetch(AssignTasbeh + query);
            if (responce.ok) {
                const result = await responce.json();
                console.log(result);
                await Tasbeehlogs();
            }
            else {
                const result = await responce.json();
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    };


    // reactivation tasbeeh api function
    const reactivateTasbeeh = async (id) => {
        try {
            const query = `Reactivecompetetasbeeh?id=${encodeURIComponent(id)}&enndate=${encodeURIComponent(deadline)}`;
            const response = await fetch(AssignTasbeh + query);
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setShowModal(false);
                await Tasbeehlogs();
            } else {
                const result = await response.text();
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    }

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

    //update date api. function
    const updatedate = async () => {
        try {
            const query = `updatedate?id=${encodeURIComponent(id)}&newenddate =${encodeURIComponent(deadline)}`;
            const response = await fetch(Group + query);
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setShowModal(false);
                await Tasbeehlogs();
            } else {
                const result = await response.text();
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // handle date time
    const handleDateChange = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;
        setdeadline(formattedDate);
    };

    useEffect(() => {
        Tasbeehlogs();
    }, [groupid]);

    useFocusEffect(
        React.useCallback(() => {
            Tasbeehlogs();
        }, [])
    );

    const Show = ({ item }) => (
        <TouchableOpacity
            disabled={item.Flag === 1 || item.Flag === 2}
            onPress={() => {
                navigation.navigate("TasbeehGroup", {
                    "groupid": groupid, "Userid": Userid, "Adminid": Adminid, "tasbeehid": item.id, "title": item.title, "tid": item.tid
                })
            }}
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

                    {(item?.deadline && item.day == null) && (
                        <View style={styles.deadlineContainer}>
                            <Ionicons name="calendar" size={16} color="#666" />
                            <Text style={styles.deadlineText}>
                                Deadline: {item.deadline.split('T')[0]}
                            </Text>
                            {Adminid == Userid && (
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => {
                                        setModalAction('update');
                                        setid(item.id);
                                        setdeadline(item.deadline.split('T')[0]);
                                        setShowModal(true);
                                    }}
                                >
                                    <Ionicons name="create-outline" size={16} color="#666" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                {(item.Flag != 0 && Adminid == Userid) &&
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                item.Flag == 1 ? styles.reopenButton : styles.reactivateButton
                            ]}
                            onPress={() => {
                                if (item.Flag === 1) {
                                    reopentasbeeh(item.id);
                                } else {
                                    if (item.deadline == today) {
                                        setModalAction('reactivate');
                                        setid(item.id);
                                        setShowModal(true);
                                    } else {
                                        reactivateTasbeeh(item.id);
                                    }
                                }
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
                <Text style={styles.headerTitle}>{title}</Text>
                {Userid == Adminid && (
                    <View style={styles.optionsWrapper}>
                        <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
                        </TouchableOpacity>

                        {showOptions && (
                            <>
                                {/* Overlay to close when clicking outside */}
                                <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
                                    <View style={styles.dropdownOverlay} />
                                </TouchableWithoutFeedback>

                                {/* Dropdown Menu */}
                                <View style={styles.dropdownMenu}>
                                    <TouchableOpacity
                                        style={styles.dropdownOption}
                                        onPress={() => {
                                            setShowOptions(false);
                                            navigation.navigate("Addmemberingroup", { groupid, Adminid });
                                        }}
                                    >
                                        <Text style={styles.dropdownOptionText}>Add Members</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dropdownOption}
                                        onPress={() => {
                                            setShowOptions(false);
                                            navigation.navigate("AllSchedule", { groupid, Userid, Adminid });
                                        }}
                                    >
                                        <Text style={styles.dropdownOptionText}>All Schedules Tasbeeh</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                )}
            </View>

            <FlatList
                data={logdata.filter(item => item.day == today.getDay() || item.day == null)}
                renderItem={Show}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 18 }}>No tasbeeh Assign Yet</Text>
                    </View>
                }
            />

            {/* Delete Confirmation Modal */}
            <Modal transparent visible={showModal} animationType="fade">
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
                                onPress={() => setShowModal(false)}
                                style={[styles.calendarModalButton, styles.calendarModalCancelButton]}
                            >
                                <Text style={styles.calendarModalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.calendarModalButton, styles.calendarModalSubmitButton]}
                                onPress={() => {
                                    if (modalAction === 'reactivate') {
                                        reactivateTasbeeh(id);
                                    } else {
                                        updatedate();
                                    }
                                }}
                            >

                                <Text style={styles.calendarModalButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal transparent visible={showModald} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowModald(false)}>
                    <View style={styles.deleteModalOverlay}>
                        <View style={styles.deleteModalContent}>
                            <Text style={styles.deleteModalTitle}>
                                Do You Want to Delete this tasbeeh
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
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 5,
        paddingHorizontal: "10%",
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: colors.white,
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
        backgroundColor: colors.primary,
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
        backgroundColor: colors.tasbeehconatiner,
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
    optionsWrapper: {
        position: 'relative',
        marginRight: 10, // Add some spacing from other header elements
    },
    dropdownMenu: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        minWidth: 180,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 100,
    },
    dropdownOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,

    },
    dropdownOptionText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownOverlay: {
        position: 'absolute',
        top: -100,
        left: -500,
        right: -500,
        bottom: -500,
        backgroundColor: 'transparent',
        zIndex: 98,
    },
    editButton: {
        marginLeft: 140,
        padding: 4,
    },

});

export default Allgrouptasbeeh;