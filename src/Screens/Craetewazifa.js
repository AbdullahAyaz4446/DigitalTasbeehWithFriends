import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Craetewazifa = ({route}) => {
    const { Userid } = route.params;
  return (
    <View>
      console.log(Userid);
    </View>
  )
}

export default Craetewazifa

const styles = StyleSheet.create({}) 