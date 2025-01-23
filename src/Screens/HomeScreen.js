import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '../utiles/colors'
import { useNavigation } from '@react-navigation/native';


const HomeScreen = ({ route }) => {
  {/* Varaible */ }
  const navigation = useNavigation();
  const { Userid ,image} = route.params;
 useEffect(()=>{
  console.log(image);
  <Image source={{uri:image}}style={styles.profile} />
 },[])
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{uri:image}}style={styles.profile} />

        <Text style={styles.headerTitle}>Home</Text>
      </View>
      <View>
        <View style={styles.dashboard}>
          <View>
            <TouchableOpacity style={styles.dashboardbutton}>
              <Image source={require('../Assests/tasbeehicon.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>Create Tasbeeh</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.dashboardbutton}>
              <Image source={require('../Assests/group.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>Group/Single</Text>
          </View>
        </View>
        <View style={styles.dashboard}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Alltasbeeh', {
              "Userid": Userid
            })} style={styles.dashboardbutton}>
              <Image source={require('../Assests/Assigntasbeeh.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>Assign Tasbeeh</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.dashboardbutton}>
              <Image source={require('../Assests/Activeunactive.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>Active/Unactive</Text>
          </View>
        </View>
        <View style={styles.dashboard}>
          <View>
            <TouchableOpacity style={styles.dashboardbutton}>
              <Image source={require('../Assests/notification.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>Notification</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.dashboardbutton}>
              <Image source={require('../Assests/friends.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>Friends</Text>
          </View>
        </View>
        <View style={styles.dashboard}>
          <View>
            <TouchableOpacity style={styles.dashboardbutton}>
              <Image source={require('../Assests/History.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>History</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Start')} style={styles.dashboardbutton}>
              <Image source={require('../Assests/Logout.png')} style={styles.logo} />
            </TouchableOpacity>
            <Text style={styles.dashboradtest}>LogOut</Text>
          </View>
        </View>

      </View>

    </View>
  )
}
export default HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headertext: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 43,
  },
  dashboardbutton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 20,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,

    elevation: 5,
  },
  dashboradtest: {
    fontSize: 13,
    fontWeight: "800",
    color: 'black',
    textAlign: 'center',
  }, header: {
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
  }, profile: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc'
  }
});


