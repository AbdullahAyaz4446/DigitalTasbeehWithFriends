import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../utiles/colors';
import Svg, { Circle } from 'react-native-svg'; 

// Add the CircularProgress component before your main component
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
  const { groupid, Userid, Adminid } = route.params;
  const [logmemberdata, setlogmemberdata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [Achived, setachived] = useState(0);
  const [goal, setgoal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filledDots, setFilledDots] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      Tasbeehdeatileslogedmember();
    }, [])
  );

  useEffect(() => {
    if (logmemberdata?.Current && logmemberdata?.Goal) {
      const progressPercentage = Math.round((logmemberdata.Current / logmemberdata.Goal) * 100);
      setProgress(progressPercentage);
    }
  }, [logmemberdata]);

  const renderProgressShapes = () => {
    const totalShapes = 10; 
  
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
  
  const Tasbeehdeatileslogedmember = async () => {
    setLoading(true);
    try {
      const query = `TasbeehProgressLogedMember?userid=${encodeURIComponent(Userid)}&groupid=${encodeURIComponent(groupid)}`;
      const response = await fetch(url + query);
      if (response.ok) {
        const result = await response.json();
        setachived(result?.Current || 0);
        setgoal(result?.Goal || 0);
        setlogmemberdata(result);
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

  const incrementProgress = async () => {
    try {
      const query = `ReadTasbehandnotificationsend?userid=${encodeURIComponent(Userid)}&groupid=${encodeURIComponent(groupid)}`;
      const response = await fetch(url + query);
      if (response.ok) {
        await Tasbeehdeatileslogedmember();
        // Dot logic
        setFilledDots(prev => {
          if (prev >= 9) return 0; 
          return prev + 1;
        });
      }
    } catch (error) {
      console.log('Error incrementing progress:', error);
    }
  };

  if (!logmemberdata || Object.keys(logmemberdata).length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group</Text>
          {
            logmemberdata && Object.keys(logmemberdata).length > 0 &&(
              <TouchableOpacity onPress={() => navigation.navigate("Deatilesgrouptasbeeh", {
                "groupid": groupid,
                "Userid": Userid,
                "Adminid": Adminid
              })}>
                <Ionicons name="options" size={30} color="#000" />
              </TouchableOpacity>
            )
          }
        </View>
        
        <View style={styles.noTasbeehContainer}>
          <Text style={styles.noTasbeehText}>No Tasbeeh Assigned To This Group Yet</Text>
        </View>

        {Adminid != Userid && (
          <TouchableOpacity style={styles.leaveButton}>
            <Text style={styles.leaveText}>Leave</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{logmemberdata.GroupTitle}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Deatilesgrouptasbeeh", {
          "groupid": groupid,
          "Userid": Userid,
          "Adminid": Adminid
        })}>
          <Ionicons name="options" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Updated Progress Display */}
      <View style={styles.progressContainer}>
        <CircularProgress progress={progress} />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            {Achived} / {goal}
          </Text>
          {renderProgressShapes()}
        </View>
      </View>
      
      <View style={{ padding: 0 }}>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
          {logmemberdata?.deadline && (
            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
              DeadLine: {logmemberdata.deadline.split('T')[0]}
            </Text>
          )}
        </Text>
      </View>
      
      <View style={{ padding: 20, backgroundColor: colors.tasbeehconatiner, borderRadius: 30 }}>
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            {logmemberdata.TasbeehTitle || ''}
          </Text>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            {logmemberdata.TasbeehTitle || 'سُبْحَانَ ٱللَّٰهِ'+"         Count:20/50"}
          </Text>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            {logmemberdata.TasbeehTitle || 'ٱلْحَمْدُ لِلَّٰهِ'+"            Count:00/50"}
          </Text>
        </View>
      </View>

      {Adminid != Userid && (
        <TouchableOpacity style={styles.leaveButton}>
          <Text style={styles.leaveText}>Leave</Text>
        </TouchableOpacity>
      )}

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={incrementProgress}>
          {/* <Text style={{fontSize:40,color:'white'}}>{Achived}/{goal}</Text> */}
          <Text style={{fontSize:40,fontWeight:'bold',color:'white'}}>Count</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasbeehContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasbeehText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
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
  progressLabel: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  fabContainer: {
    position: 'absolute',
    bottom:0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: "100%",
    height: 300,
    borderRadius: 0,
    backgroundColor:colors.tasbeehconatiner,
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
  leaveButton: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderTopRightRadius: 20,
  },
  leaveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default TasbeehGroup;