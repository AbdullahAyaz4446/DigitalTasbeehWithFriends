
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect,useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Notification = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [Showmodel, setmodel] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [leavemembers, setleavemembers] = useState([]);
    const [tasbeehdeatiles, settasbeehdeatiles] = useState([]);
    const [combinedData, setCombinedData] = useState([]); // Combined when needed
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // All Request Api Function 
    const Allrequest = async () => {
        try {
            const query = `Showallrequest?userid=${encodeURIComponent(Userid)}`;
            const response = await fetch(url + query);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setNotifications(data);
            }
            else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    }



    // Api Function to fetch all  request tasbeeh deatiles
    const Allrequestdetails = async (id) => {
        try {
            console.log(id);
            const query = `Gettasbeehwazifadeatiles?id=${encodeURIComponent(id)}`;
            const response = await fetch(Wazifa + query);
            if (response.ok) {
                const data = await response.json();
                settasbeehdeatiles(data);
                console.log(data);
            }
            else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Accept request  Api Function
    const Acceptrequest = async (id) => {
        try {
            const query = `AcceptRequest?requestid=${encodeURIComponent(id)}&userid=${encodeURIComponent(Userid)}`;
            const response = await fetch(SendRequest + query, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
            else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Reject request  Api Function
    const Rejectrequest = async (id) => {
        try {
            const query = `RejectRequest?requestid=${encodeURIComponent(id)}`;
            const response = await fetch(SendRequest + query);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
            else {
                const ans = await response.text();
                console.log(ans);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //get all leave members  tasbeeh deatiles
    const leavemembersdeatiles = async () => {
        try {
            const query = `allleavegroupmember?userid=${encodeURIComponent(Userid)}`;
            const response = await fetch(url + query);
            if (response.ok) {
                const data = await response.json();
                console.log('Leave Data:', data);
                const transformedData = data.map(item => ({
                    ...item,
                    Type: "leave"
                }));
                setleavemembers(transformedData);
            } else {
                console.error('Leave Error:', await response.text());
            }
        } catch (error) {
            console.error('Leave Exception:', error);
        }
    };

    // Reassign Modal Component
    const ReassignModal = () => (
        <Modal
            transparent={true}
            visible={showReassignModal}
            animationType="slide"
            onRequestClose={() => setShowReassignModal(false)}
        >
            <TouchableWithoutFeedback onPress={() => setShowReassignModal(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.reassignModalContainer}>
                            <Text style={styles.modalTitle}>Reassign Options</Text>
                            <Text style={styles.modalSubtitle}>Choose how to redistribute the remaining count:</Text>

                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    handleEqualDistribution(selectedItem.Group_Tasbeeh_id);
                                    setShowReassignModal(false);
                                }}
                            >
                                <Ionicons name="git-compare-outline" size={22} color={colors.primary} />
                                <Text style={styles.modalOptionText}>Equal Distribution</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    navigation.navigate('ManualAssignment', {
                                        groupTasbeehId: selectedItem.Group_Tasbeeh_id,
                                        remainingCount: selectedItem.Assign_Count - selectedItem.Current_Count,
                                        groupId: selectedItem.Group_id
                                    });
                                    setShowReassignModal(false);
                                }}
                            >
                                <Ionicons name="create-outline" size={22} color={colors.primary} />
                                <Text style={styles.modalOptionText}>Assign Manually</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalOption}
                                onPress={() => {
                                    navigation.navigate("Addmemberingroup", { selectedItem,Adminid:Userid
                                    });
                                    setShowReassignModal(false);
                                }}
                                
                            >
                                <Ionicons name="people-outline" size={22} color={colors.primary} />
                                <Text style={styles.modalOptionText}>Select Members</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setShowReassignModal(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );


    useEffect(() => {
        leavemembersdeatiles();
        Allrequest();
    }, [Userid]);

    // Usefocuseffect To Get All from specfic members or munnaly assign when you come back
      useFocusEffect(
        React.useCallback(() => {
          leavemembersdeatiles();
        }, [])
      );
    //combine leave members and notifications
    useEffect(() => {
        const combined = [...(notifications || []), ...(leavemembers || [])];
        setCombinedData(combined);
        console.log("Combined Data:", combined);
    }, [notifications, leavemembers]);



    // Handle accept action
    const handleAccept = (id) => {
        Alert.alert(
            "Accept Request",
            "Are you sure you want to accept this tasbeeh?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Accept",
                    onPress: () => {


                        Acceptrequest(id);
                        setNotifications(prev => prev.filter(item => item.id !== id));
                        console.log("Accepted notification:", id);
                    }
                }
            ]
        );
    };

    // Handle reject action
    const handleReject = (id) => {
        Alert.alert(
            "Reject Request",
            "Are you sure you want to reject this tasbeeh?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Reject",
                    onPress: () => {
                        Rejectrequest(id);
                        setNotifications(prev => prev.filter(item => item.id !== id));
                        console.log("Rejected notification:", id);
                    }
                }
            ]
        );
    };

    const NotificationItem = ({ item }) => {
        if (item.Type === "leave") {
            return (
                <View style={styles.leaveNotificationContainer}>
                    <View style={styles.leaveNotificationHeader}>
                        <Ionicons name="people-outline" size={24} color={colors.primary} />
                        <Text style={styles.leaveNotificationTitle}>Group Member Left</Text>
                    </View>

                    <View style={styles.leaveNotificationBody}>
                        <Text style={styles.leaveNotificationText}>{item.Message}</Text>

                    </View>
                    <TouchableOpacity
                        style={styles.assignButton}
                        onPress={() => {
                           
                            setSelectedItem(item);
                            setShowReassignModal(true);
                            
                        }}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.assignButtonText}> Reassign</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );

        }
        return (
            <View style={styles.leaveNotificationContainer}>
                <View style={styles.notificationHeader}>
                    <Ionicons name="notifications-outline" size={24} color={colors.primary} />
                    <Text style={styles.notificationTitle}>New Tasbeeh Request</Text>
                    <View style={{ alignItems: 'flex-end', flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => {
                                Allrequestdetails(item.Tasbeehname.Id);
                                setmodel(true);
                            }}
                            style={styles.infoButton}
                        >
                            <Ionicons name="information-circle" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.cardText}>
                        <Text style={styles.highlightText}>{item.GroupTitle}</Text>
                        <Text> sent you a request to read </Text>
                        <Text style={styles.highlightText}>{item.Tasbeehname.Title}</Text>
                        <Text> (count: </Text>
                        <Text style={styles.highlightText}>{item.Count}</Text>
                        <Text>)</Text>
                    </Text>
                </View>


                <View style={styles.cardFooter}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => handleAccept(item.id)}
                    >
                        <Ionicons name="checkmark-outline" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleReject(item.id)}
                    >
                        <Ionicons name="ban-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
               
            </View>
        );

    };

   
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            {combinedData.length > 0 ? (
                <FlatList
                    data={combinedData}
                    renderItem={NotificationItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="notifications-off" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>No notifications available</Text>
                </View>
            )}

            {/* Enhanced Tasbeeh Details Modal */}
            <Modal transparent visible={Showmodel} animationType="fade">
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => {
                        setmodel(false);
                        settasbeehdeatiles([]);
                    }}>
                        <View style={styles.modalBackground} />
                    </TouchableWithoutFeedback>

                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Tasbeeh Details</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setmodel(false);
                                    settasbeehdeatiles([]);
                                }}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.modalContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {tasbeehdeatiles.map((item, index) => (
                                <View key={index} style={styles.detailItemContainer}>
                                    {(item.Type === "Wazifa" || item.Type === "Quran") && (
                                        <View style={styles.typeBadge}>
                                            <Text style={styles.typeText}>{item.Type}</Text>
                                        </View>
                                    )}
                                    <Text style={styles.detailText}>{item.Text}</Text>
                                    <View style={styles.countContainer}>
                                        <Ionicons name="repeat-outline" size={18} color="#666" />
                                        <Text style={styles.countText}>Count: {item.Count}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
             <ReassignModal/>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
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
    listContainer: {
        paddingBottom: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
    },

    // Notification Card Styles
    cardContainer: {
        backgroundColor: colors.textfiles,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    infoButton: {
        padding: 4,
    },
    cardBody: {
        marginBottom: 16,
    },
    cardText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },
    highlightText: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
    },
    actionButton: {
        width: 48, // Fixed width for square buttons
        height: 48, // Fixed height
        borderRadius: 24, // Makes it circular
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    // Tasbeeh Detail Card
    detailCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    detailType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    detailCount: {
        fontSize: 14,
        color: '#666',
    },
    confirmationButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    messageCardContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
    },
    messageText: {
        color: 'black',
        fontSize: 14,
    },
    timestampText: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'right',
    },
    leaveNotificationContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    leaveNotificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    leaveNotificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginLeft: 8,
    },
    leaveNotificationBody: {
        marginBottom: 12,
    },
    leaveNotificationText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    leaveNotificationMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    assignButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    assignButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,

    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginLeft: 8,
    },
    reassignModalContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '85%',
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        marginBottom: 10,
    },
    modalOptionText: {
        fontSize: 16,
        color: '#2c3e50',
        marginLeft: 12,
    },
    modalCancelButton: {
        marginTop: 10,
        padding: 14,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: 16,
        color: '#e74c3c',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
    },
    modalBackground: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 20,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primary,
        textAlign: 'center',
    },
    closeButton: {
        padding: 4,
    },
    modalContent: {
        padding: 16,
    },
    detailItemContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    typeBadge: {
        backgroundColor: colors.primary + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    typeText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '500',
    },
    detailText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 12,
        textAlign: 'right',
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    countText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
    },
});

export default Notification;