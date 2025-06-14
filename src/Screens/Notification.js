
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';

const Notification = ({ route }) => {
    const navigation = useNavigation();
    const { Userid } = route.params;
    const [Showmodel, setmodel] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [tasbeehdeatiles, settasbeehdeatiles] = useState([]);
    const [showModal, setShowModal] = useState(false);

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

        // Api Function to fetch all leave members detiles
      
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
        const leavemembersdeatiles=async()=>{
            try {
                const query=`allleavegroupmember?userid=${encodeURIComponent(Userid)}`;
                const responce=await fetch(url+query);
                if(responce.ok){
                    const data=await responce.json();
                    console.log(data);
                }
                else{
                      const data=await responce.json();
                    console.log(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
    
    
    
        useEffect(() => {
            leavemembersdeatiles();
            Allrequest();
        }, []);
    
    
    
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
    

    // Updated Notification Item Component with Card View
    const NotificationItem = ({ item }) => (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.GroupTitle}</Text>
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
                    <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                
                <View style={styles.divider} />
                
                <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(item.id)}
                >
                    <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Updated Tasbeeh Details Item for Modal
    const TasbeehDetailItem = ({ item }) => (
        <View style={styles.detailCard}>
            {(item.Type == "Wazifa" || item.Type == "Quran") && (
                <Text style={styles.detailType}>{item.Type}</Text>
            )}
            <Text style={styles.detailText}>{item.Text}</Text>
            <Text style={styles.detailCount}>Count: {item.Count}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={NotificationItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="notifications-off" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>No notifications available</Text>
                </View>
            )}

            {/* Details Modal */}
            <Modal transparent visible={Showmodel} animationType="fade">
                <TouchableWithoutFeedback onPress={() => {
                    setmodel(false);
                    settasbeehdeatiles([]);
                }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Tasbeeh Details</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        setmodel(false);
                                        settasbeehdeatiles([]);
                                    }}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>
                            
                            <FlatList
                                data={tasbeehdeatiles}
                                renderItem={TasbeehDetailItem}
                                keyExtractor={(item, index) => index.toString()}
                                style={styles.detailsList}
                                contentContainerStyle={styles.detailsListContent}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal transparent visible={showModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmationCard}>
                        <Text style={styles.confirmationTitle}>Confirm Alert</Text>
                        <Text style={styles.confirmationText}>Do you want to delete this group?</Text>
                        
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={[styles.confirmationButton, styles.cancelButton]}
                            >
                                <Text style={styles.confirmationButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={() => deleteGroup()}
                                style={[styles.confirmationButton, styles.deleteButton]}
                            >
                                <Text style={styles.confirmationButtonText}>Delete</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        justifyContent: 'center',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
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
        backgroundColor: '#ddd',
        marginHorizontal: 8,
    },
    
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '90%',
        maxHeight: '70%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    detailsList: {
        flexGrow: 1,
    },
    detailsListContent: {
        paddingBottom: 16,
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
    
    // Confirmation Modal
    confirmationCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '90%',
        padding: 20,
    },
    confirmationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    confirmationText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 24,
    },
    confirmationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmationButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        marginLeft: 8,
    },
    confirmationButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default Notification;