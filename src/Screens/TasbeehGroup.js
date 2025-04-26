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

const TasbeehGroup = ({ route }) => {
  const navigation = useNavigation();
  const { groupid, Userid, Adminid } = route.params;
  const [logmemberdata, setlogmemberdata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [Achived, setachived] = useState(0);
  const [goal, setgoal] = useState(0);
  const [loading, setLoading] = useState(true);

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

      <View style={styles.progressContainer}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>Your Progress: {Achived}/{goal}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
      </View>
      
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
          {logmemberdata?.deadline && (
            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
              DeadLine: {logmemberdata.deadline.split('T')[0]}
            </Text>
          )}
        </Text>
      </View>
      
      <View style={{ padding: 20, backgroundColor: colors.tasbeehconatiner, borderRadius: 30 }}>
        <View style={{ backgroundColor: 'pink', alignSelf: 'center' }}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            {logmemberdata.TasbeehTitle || 'Tasbeeh Name'}
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
          <Ionicons name="add" size={40} color="white" />
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
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTextContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: 'black'
  },
  progressBar: {
    height: 30,
    width: '50%',
    backgroundColor: '#e0e0e0',
    borderRadius: 40,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
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
  }
});

export default TasbeehGroup;