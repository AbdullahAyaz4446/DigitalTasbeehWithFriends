import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
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
  const { tasbeehId, Name, astid, tid } = route.params;
  const [logmemberdata, setlogmemberdata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [Achived, setachived] = useState(0);
  const [goal, setgoal] = useState(0);
  const [filledDots, setFilledDots] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [tasbeehdeatiles, settasbeehdeatiles] = useState([]);
  const [itemProgress, setItemProgress] = useState({});
  const [showsavelogModal, setShowsavelogModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const [isChainComplete, setIsChainComplete] = useState(false);
  const [currentTasbeehType, setCurrentTasbeehType] = useState('');



  const handleSaveProgress = async () => {
    try {
      if (isChainComplete || currentTasbeehType !== 'Quran') return;
      setIsSaving(true);
      setSaveError(false);
      const tasbeehlog = {
        Userid: astid,
        grouptasbeehid: tasbeehId,
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
      const query = `fetchtasbeehlog?Userid=${encodeURIComponent(astid)}&grouptasbeehid=${encodeURIComponent(tasbeehId)}`;
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


  {/*Use Effects*/ }
  useFocusEffect(
    React.useCallback(() => {
      Singletasbeehprogress();
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
    if (logmemberdata?.Achieved && logmemberdata?.Goal) {
      const progressPercentage = Math.round((logmemberdata.Achieved / logmemberdata.Goal) * 100);
      setProgress(progressPercentage);
      setIsComplete(progressPercentage >= 100);
      setIsLoading(false);
    }
    tasbeehdeatilestdetails();
  }, [logmemberdata]);


  useEffect(() => {
    const initializeProgress = async () => {
      const savedProgress = await loadProgress();
      setItemProgress(savedProgress);
    };
    initializeProgress();
  }, []);


  const STORAGE_KEY = `@TasbeehProgress_${tasbeehId}_${astid}_${tid}`;

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


  {/* Api Functions*/ }
  const Singletasbeehprogress = async () => {
    try {

      const query = `Getsingletasbeehdata?id=${encodeURI(tasbeehId)}&tasbeehid=${encodeURI(astid)}`
      const response = await fetch(Singletasbeeh + query);
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setachived(result?.Achieved || 0);
        setgoal(result?.Goal || 0);
        setlogmemberdata(result);
        setIsLoading(false);
      }
      else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // const incrementProgress = async () => {
  //   try {
  // const query = `Readsingletasbeeh?id=${encodeURI(tasbeehId)}&tasbeehid=${encodeURI(astid)}`
  // const response = await fetch(Singletasbeeh + query);
  //     if (response.ok) {
  //       const result = await response.json();
  //       await Singletasbeehprogress();
  //       setFilledDots(prev => {
  //         if (prev >= 7) return 0;
  //         return prev + 1;
  //       });
  //     }
  //     else {
  //       const result = await response.json();
  //       console.log(result);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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

        // Check if this was the last item in the chain
        const allCompleted = tasbeehdeatiles.every((item, idx) =>
          (updatedProgress[idx] || 0) >= item.Count
        );

        if (allCompleted) {
          await handleChainCompletion();
        }
      }

      setFilledDots(prev => (prev >= 7 ? 0 : prev + 1));
    } catch (error) {
      console.log('Error incrementing progress:', error);
    }
  };


  const handleChainCompletion = async () => {
    try {
      // Reset all item progress
      setItemProgress({});
      await AsyncStorage.removeItem(STORAGE_KEY);

      // Increment main counter
      const query = `Readsingletasbeeh?id=${encodeURI(tasbeehId)}&tasbeehid=${encodeURI(astid)}`
      const response = await fetch(Singletasbeeh + query);

      if (response.ok) {
        const result = await response.json();
        await Singletasbeehprogress();

      }
    } catch (error) {
      console.log('Error handling chain completion:', error);
    }
  };

  const closetasbeeh = async () => {
    try {
      const query = `Closetasbeeh?id=${encodeURI(astid)}`;
      const responce = await fetch(Singletasbeeh + query);
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

  if (isLoading || !logmemberdata) {
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
        <Text style={styles.headerTitle}>{Name}</Text>

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
                    closetasbeeh();
                  }}
                >
                  <Text style={styles.dropdownOptionText}>Close Tasbeeh</Text>
                </TouchableOpacity>
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
                {/* <Ionicons
                  name={isComplete ? "checkmark-circle" : "ellipse"}
                  size={20}
                  color={isComplete ? colors.primary : (!isPreviousComplete ? '#ccc' : colors.primary)}
                /> */}
                <View style={[
                  styles.countBadge,
                  !isPreviousComplete && styles.disabledBadge,
                  isComplete && styles.completedBadge
                ]}>
                  <Text style={styles.countText}>{currentCount}</Text>
                </View>
                <Text style={[
                  styles.cardText
                  // styles.cardText,
                  // !isPreviousComplete && styles.disabledText,
                  // isComplete && styles.completedText
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
      {/* Save Progress Modal */}
      <Modal transparent visible={showsavelogModal && currentTasbeehType === 'Quran' && !isChainComplete} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowsavelogModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Ionicons name="bookmark" size={24} color={colors.primary} />
                <Text style={styles.modalTitle}>Save Your Reading Progress</Text>
              </View>

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

      {/* Reminder Modal */}
      <Modal transparent visible={showReminderModal && currentTasbeehType === 'Quran' && !isChainComplete} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowReminderModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { maxWidth: '90%' }]}>
              <View style={styles.modalHeader}>
                <Ionicons name="time" size={24} color={colors.primary} />
                <Text style={styles.modalTitle}>Welcome Back!</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>You left at:</Text>
                <View style={[styles.inputField, { backgroundColor: '#f8f9fa' }]}>
                  <Text style={{ fontSize: 16, color: '#333' }}>
                    {savedProgress?.note || 'No position saved'}
                  </Text>
                </View>
              </View>

              <Text style={[styles.sectionSubtitle, { textAlign: 'center', marginBottom: 20 }]}>
                Last saved: {savedProgress?.leaveat}
              </Text>

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
    color: 'red',
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
    color:'black'
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

export default TasbeehGroup;