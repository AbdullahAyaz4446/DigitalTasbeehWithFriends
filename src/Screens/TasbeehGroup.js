import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';



const CircularProgress = ({ progress, size = 150, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          stroke="#e0e0e0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke={colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={{
        position: 'absolute',
        textAlign: 'center',
        lineHeight: size,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
      }}>
        {progress}%
      </Text>
    </View>
  );
};

const TasbeehGroup = ({ route }) => {

  const navigation = useNavigation();
  const { groupid, Userid, Adminid, tasbeehid, title, tid } = route.params;
  const [logmemberdata, setlogmemberdata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [Achived, setachived] = useState(0);
  const [goal, setgoal] = useState(0);
  const [filledDots, setFilledDots] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [tasbeehdeatiles, settasbeehdeatiles] = useState([]);
  const [itemProgress, setItemProgress] = useState({});
  const flatListRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [tasbeehdeatilesid, settasbeehdeatilesid] = useState(null);
  const [Message, setMessage] = useState("");
  const [showsavelogModal, setShowsavelogModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [currentTasbeehType, setCurrentTasbeehType] = useState('');
  const [isChainComplete, setIsChainComplete] = useState(false);



  const handleSaveProgress = async () => {
    try {
      if (isChainComplete || currentTasbeehType !== 'Quran') return;
      setIsSaving(true);
      setSaveError(false);
      const tasbeehlog = {
        Userid: Userid,
        grouptasbeehid: tasbeehid,
        note: notes,
        startdate: null,
        leaveat: null

      };
      const response = await fetch(Group + "Savetasbeehlog", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasbeehlog),
      });
      if (response.ok) {
        navigation.goBack();
      } else {
        setSaveError(true);
      }
    } catch (error) {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };


  const handlefetchProgress = async () => {
    try {
      setIsSaving(true);
      setSaveError(false);
      const query = `fetchtasbeehlog?Userid=${encodeURIComponent(Userid)}&grouptasbeehid=${encodeURIComponent(tasbeehid)}`;
      const response = await fetch(Group + query);
      console.log("response", response);
      if (response.ok) {
        const data = await response.json();
        console.log("tasbeeh log ......", data);
        setSavedProgress(data);
        setShowReminderModal(true);

      } else {
        setSaveError(true);
        console.log("helo error");
      }
    } catch (error) {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };




  const toggleOptions = () => {
    setShowOptions(!showOptions);
  }

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  useFocusEffect(
    React.useCallback(() => {
      Tasbeehdeatileslogedmember();
    }, [])
  );

  useEffect(() => {
    handlefetchProgress();
  }, [])



  useEffect(() => {
    const initializeProgress = async () => {
      const savedProgress = await loadProgress();
      setItemProgress(savedProgress);

      // Set initial type from first incomplete item
      const firstIncomplete = tasbeehdeatiles.findIndex((item, idx) =>
        (savedProgress[idx] || 0) < item.Count
      );
      if (firstIncomplete !== -1) {
        setCurrentTasbeehType(tasbeehdeatiles[firstIncomplete].Type || '');
      }
    };
    initializeProgress();
  }, [tasbeehdeatiles]);
  useEffect(() => {

    if (logmemberdata?.Current && logmemberdata?.Goal) {
      const progressPercentage = Math.round((logmemberdata.Current / logmemberdata.Goal) * 100);
      setProgress(progressPercentage);
      setIsComplete(progressPercentage >= 100);
    }
    console.log("tid", tid, "userid")
    tasbeehdeatilestdetails();
    Tasbeehincremnet();
  }, [logmemberdata])


  useEffect(() => {
    const initializeProgress = async () => {
      const savedProgress = await loadProgress();
      setItemProgress(savedProgress);
    };
    initializeProgress();
    scrollToTop();
  }, []);

  const renderProgressShapes = () => {
    const totalShapes = 7;

    return (
      <View style={styles.shapesContainer}>
        {[...Array(totalShapes)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.shape,
              {
                backgroundColor: index < filledDots ? colors.primary : '#e0e0e0',
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const STORAGE_KEY = `@TasbeehProgress_${Userid}_${groupid}_${tasbeehid}`;

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(STORAGE_KEY);
      return savedProgress ? JSON.parse(savedProgress) : {};
    } catch (error) {
      console.error('Error loading progress:', error);
      return {};
    }
  };


  const saveProgress = async (progressData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  const Tasbeehdeatileslogedmember = async () => {
    try {
      const query = `TasbeehProgressLogedMember?userid=${encodeURIComponent(Userid)}&groupid=${encodeURIComponent(groupid)}&tasbeehid=${encodeURIComponent(tasbeehid)}`;
      const response = await fetch(url + query);
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setachived(result?.Current || 0);
        setgoal(result?.Goal || 0);
        setlogmemberdata(result);
        console.log("groupusertasbeehdeatilesid", result?.groupusertasbeehdeatilesid);
        settasbeehdeatilesid(result?.groupusertasbeehdeatilesid);
      } else {
        setlogmemberdata(null);
      }
    } catch (error) {
      console.log(error);
      setlogmemberdata(null);
    } finally {
      setLoading(false);
    }
  };
  const Tasbeehincremnet = async () => {
    try {
      const query = `IncremnetInTasbeeh?groupid=${encodeURIComponent(groupid)}&tasbeehid=${encodeURIComponent(tasbeehid)}`
      const responce = await fetch(Group + query);
      if (responce.ok) {
        const res = await responce.json();
        console.log(res);
      }
      else {
        const res = await responce.json();
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const incrementProgress = async () => {
    try {
      // Get current active index (first incomplete item)
      const activeIndex = tasbeehdeatiles.findIndex((item, index) => {
        const currentCount = itemProgress[index] || 0;
        return currentCount < item.Count;
      });

      if (activeIndex === -1) {
        // All items completed - reset and increment main counter
        await handleChainCompletion();
        return;
      }
      // ADD THIS: Get and set the current tasbeeh type
      const currentItem = tasbeehdeatiles[activeIndex];
      setCurrentTasbeehType(currentItem.Type || '');

      // Update count for current item
      const updatedProgress = {
        ...itemProgress,
        [activeIndex]: (itemProgress[activeIndex] || 0) + 1
      };

      setItemProgress(updatedProgress);
      await saveProgress(updatedProgress);

      // Check if item is now complete
      if (updatedProgress[activeIndex] >= tasbeehdeatiles[activeIndex].Count) {
        console.log(`Completed ${tasbeehdeatiles[activeIndex].Text}`);
        scrollToTop();
        // Check if this was the last item in the chain
        const allCompleted = tasbeehdeatiles.every((item, idx) =>
          (updatedProgress[idx] || 0) >= item.Count
        );
        setIsChainComplete(allCompleted);
        if (allCompleted) {
          await handleChainCompletion();
        }
      }

      setFilledDots(prev => (prev >= 7 ? 0 : prev + 1));
    } catch (error) {
      console.log('Error incrementing progress:', error);
    }
  };





  // const incrementProgress = async () => {
  //   try {
  //     // Get current active index
  //     const activeIndex = tasbeehdeatiles.findIndex((item, index) => {
  //       const currentCount = itemProgress[index] || 0;
  //       return currentCount < item.Count;
  //     });

  //     if (activeIndex === -1) {
  //       await handleChainCompletion();
  //       return;
  //     }

  //     // Update count for current item
  //     const updatedProgress = {
  //       ...itemProgress,
  //       [activeIndex]: (itemProgress[activeIndex] || 0) + 1
  //     };

  //     setItemProgress(updatedProgress);
  //     await saveProgress(updatedProgress);

  //     // Check if item is now complete
  //     if (updatedProgress[activeIndex] >= tasbeehdeatiles[activeIndex].Count) {
  //       // Smooth scroll to next item or top if last item
  //       const nextIndex = activeIndex + 1;
  //       if (nextIndex < tasbeehdeatiles.length) {
  //         flatListRef.current?.scrollToIndex({
  //           index: nextIndex,
  //           animated: true,
  //           viewPosition: 0.5 // Scroll to middle of screen
  //         });
  //       } else {
  //         // Only scroll to top if we're not at the beginning
  //         flatListRef.current?.scrollToOffset({
  //           offset: 0,
  //           animated: true
  //         });
  //       }
  //     }

  //     setFilledDots(prev => (prev >= 7 ? 0 : prev + 1));
  //   } catch (error) {
  //     console.log('Error incrementing progress:', error);
  //   }
  // };


  const handleChainCompletion = async () => {
    try {
      // Reset all item progress
      setItemProgress({});
      await AsyncStorage.removeItem(STORAGE_KEY);

      // Increment main counter
      const query = `ReadTasbehandnotificationsend?userid=${encodeURIComponent(Userid)}&groupid=${encodeURIComponent(groupid)}&tasbeehid=${encodeURIComponent(tasbeehid)}`;
      const response = await fetch(url + query);

      if (response.ok) {
        const result = await response.json();
        await Tasbeehdeatileslogedmember();

      }
    } catch (error) {
      console.log('Error handling chain completion:', error);
    }
  };

  // close tasbeeh api function
  const closetasbeeh = async () => {
    try {
      const query = `Closetasbeeh?id=${encodeURI(tasbeehid)}`;
      const responce = await fetch(AssignTasbeh + query);
      if (responce.ok) {
        const result = await responce.json();
        console.log(result);
        navigation.goBack();
      }
      else {
        const result = await responce.json();
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }


  // Api Function to fetch  tasbeeh deatiles
  const tasbeehdeatilestdetails = async () => {
    try {
      const query = `Gettasbeehwazifadeatiles?id=${encodeURIComponent(tid)}`;
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

  // api function to leave tasbeeh
  const leavetasbeeh = async () => {
    try {


      const query = `Leavetasbeeh?id=${encodeURIComponent(tasbeehdeatilesid)}&Message=${encodeURIComponent(Message)}&userid=${encodeURIComponent(Userid)}`;
      const responce = await fetch(url + query);
      console.log(responce);
      if (responce.ok) {
        const data = await responce.json();
        console.log(data);
        navigation.goBack();
      }
      else {
        console.log("not leave");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Tasbeeh Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (currentTasbeehType === 'Quran' && !isChainComplete) {
            setShowsavelogModal(true);
          } else {
            navigation.goBack();
          }
        }}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.optionsWrapper}>
          <TouchableOpacity onPress={toggleOptions}>
            <Ionicons name="options" size={30} color="#000" />
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
                    navigation.navigate("Deatilesgrouptasbeeh", { groupid, tasbeehid, Userid, title });
                  }}
                >
                  <Text style={styles.dropdownOptionText}>Progress</Text>
                </TouchableOpacity>

                {Userid == Adminid ? (
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() => {
                      setShowOptions(false);
                      closetasbeeh();

                    }}
                  >
                    <Text style={[styles.dropdownOptionText, { color: 'red' }]}>Close Tasbeeh</Text>
                  </TouchableOpacity>
                ) :
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() => {
                      setShowOptions(false);
                      setShowModal(true);

                    }}
                  >
                    <Text style={[styles.dropdownOptionText, { color: 'red' }]}>Leave Tasbeeh</Text>
                  </TouchableOpacity>
                }
              </View>
            </>
          )}
        </View>
      </View>


      <View style={styles.progressContainer}>
        <CircularProgress progress={progress} />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            {Achived} / {goal}
          </Text>
          {renderProgressShapes()}
        </View>
      </View>

      <View style={{ padding: 20, height: 350 }}>


        <FlatList
          ref={flatListRef}
          data={tasbeehdeatiles}
          renderItem={({ item, index }) => {
            const currentCount = itemProgress[index] || 0;
            const isComplete = currentCount >= item.Count;
            const isPreviousComplete = index === 0 ||
              (itemProgress[index - 1] >= tasbeehdeatiles[index - 1].Count);
            const isChainComplete = tasbeehdeatiles.every((item, idx) =>
              (itemProgress[idx] || 0) >= item.Count
            );
            return (
              <View style={[
                styles.card,
                !isPreviousComplete && styles.disabledCard,
                isComplete && styles.completedCard,
                isChainComplete && styles.chainCompletedCard
              ]}>

                <View style={[
                  styles.countBadge,
                  !isPreviousComplete && styles.disabledBadge,
                  isComplete && styles.completedBadge
                ]}>
                  <Text style={styles.countText}>{currentCount}</Text>
                </View>
                <Text style={[
                  styles.cardText
                ]}>
                  {item.Text}
                </Text>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {/* {currentCount}/{item.Count} */}
                  </Text>
                  <View style={[
                    styles.countBadge,
                    !isPreviousComplete && styles.disabledBadge,
                    isComplete && styles.completedBadge
                  ]}>
                    <Text style={styles.countText}>{item.Count}</Text>
                  </View>
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 300 }} // Add space for FAB
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 30,
          }}
        />
      </View>


      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, isComplete && styles.disabledFab]}
          onPress={incrementProgress}
          disabled={isComplete}
        >
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>
            {isComplete ? 'Completed!' : 'Count'}
          </Text>
        </TouchableOpacity>
      </View>


      <Modal transparent visible={showModal} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Leave Tasbeeh</Text>
              <Text style={styles.modalSubtitle}>Are you sure you want to leave this Tasbeeh?</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Reason (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your reason..."
                  placeholderTextColor="#888"
                  value={Message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={[styles.actionButton, styles.cancelButton]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={leavetasbeeh}
                  style={[styles.actionButton, styles.leaveButton]}
                >
                  <Text style={styles.buttonText}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal transparent visible={showsavelogModal && currentTasbeehType === 'Quran' && !isChainComplete} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowsavelogModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Header with icon */}
              <View style={styles.modalHeader}>
                <Ionicons name="bookmark" size={24} color={colors.primary} />
                <Text style={styles.modalTitle}>Save Your Reading Progress</Text>
              </View>

              {/* Progress tracking section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Where did you stop?</Text>
                <Text style={styles.sectionSubtitle}>Example: "Ayah 45 or "Line 5"</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Enter exact position..."
                  value={notes}
                  onChangeText={setNotes}
                  keyboardType='numeric'
                />
              </View>

              {/* Optional notes */}
              {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.inputField, { height: 80 }]}
                  placeholder="Example: Stopped at morning prayer, will continue after work"
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View> */}

              {/* Network status indicator */}
              {isSaving && (
                <View style={styles.networkStatus}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.networkStatusText}>Saving your progress...</Text>
                </View>
              )}

              {saveError && (
                <View style={styles.errorStatus}>
                  <Ionicons name="warning" size={16} color="#ff4444" />
                  <Text style={styles.errorStatusText}>Failed to save. Please try again.</Text>
                </View>
              )}

              {/* Action buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowsavelogModal(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveProgress}
                  disabled={isSaving}
                >
                  <Ionicons name="save" size={18} color="white" />
                  <Text style={styles.saveBtnText}> Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal transparent visible={showReminderModal && currentTasbeehType === 'Quran' && !isChainComplete} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowReminderModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { maxWidth: '90%' }]}>
              {/* Header with different icon */}
              <View style={styles.modalHeader}>
                <Ionicons name="time" size={24} color={colors.primary} />
                <Text style={styles.modalTitle}>Welcome Back!</Text>
              </View>

              {/* Saved progress display */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>You left at:</Text>
                <View style={[styles.inputField, { backgroundColor: '#f8f9fa' }]}>
                  <Text style={{ fontSize: 16, color: '#333' }}>
                    {savedProgress?.note || 'No position saved'}
                  </Text>
                </View>

                {savedProgress?.notes && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Your Notes:</Text>
                    <View style={[styles.inputField, { backgroundColor: '#f8f9fa', minHeight: 60 }]}>
                      <Text style={{ fontSize: 16, color: '#333' }}>
                        {savedProgress.note}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* Additional info */}
              <Text style={[styles.sectionSubtitle, { textAlign: 'center', marginBottom: 20 }]}>
                Last saved: {savedProgress?.leaveat}
              </Text>

              {/* Action buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { flex: 1 }]}
                  onPress={() => setShowReminderModal(false)}
                >
                  <Text style={styles.cancelBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
};


export default TasbeehGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: colors.primary,
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressTextContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  shapesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  shape: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: "100%",
    height: 200,
    borderRadius: 0,
    backgroundColor: colors.tasbeehconatiner,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  disabledFab: {
    backgroundColor: '#cccccc',
  },
  optionsWrapper: {
    position: 'relative',
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
  bulletIcon: {
    marginRight: 12,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,

  },
  cardText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: 5,
  },
  countText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    height: 12,
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  completedCard: {
    backgroundColor: '#f0f9ff',
  },
  disabledText: {
    color: '#999',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  disabledBadge: {
    backgroundColor: '#ccc',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginRight: 8,
    color: '#666',
    fontSize: 14,
  },
  completionBanner: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  completionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chainCompletedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#333',
  },
  leaveButtonText: {
    color: 'white',
  },
  confirmationText: {
    fontSize: 20,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#444',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    color: 'black'
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  networkStatusText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  errorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  errorStatusText: {
    marginLeft: 8,
    color: '#ff4444',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelBtnText: {
    color: '#555',
    fontWeight: '500',
  },
  saveBtn: {
    flex: 1,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '500',
  },
});
