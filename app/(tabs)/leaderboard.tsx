import { Image, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function LeaderboardScreen() {
  const BASE_URL = "https://dev-gt7gzrbyx15dlna.api.raw-labs.com/api/v1/";
  const ENDPOINTS = {
    "leaderboards": "leaderboards"
  }
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, [])

  const getStudents = () => {
    let students = [];
    axios.get(`${BASE_URL}${ENDPOINTS.leaderboards}`)
      .then(res => {
        students = res.data;
        setStudents(students);
      })
  }

  return (
      <ScrollView>
        <View style={styles.leaderboardContainer}>
          <Text style={styles.LeaderboardColor}>LEADERBOARD</Text>
        </View>
    <View>
       {
        students.map((student, index) => {
          return  <View key={index} style={leaderboardStyle.studentAlignment}>
                    <View style={leaderboardStyle.studentLayer}>
                      <View style={leaderboardStyle.picture}></View>
                      <View style={leaderboardStyle.spacer}></View>
                      <Text style={leaderboardStyle.namePosition}>{student.name}</Text>
                      <View style={leaderboardStyle.spacer}></View>
                      <Text style={leaderboardStyle.namePosition}>{student.score}</Text>
                    </View>
                  </View>
        })
      }
    </View>
    </ScrollView>
  );
}

const leaderboardStyle = StyleSheet.create({
  studentLayer: {
    backgroundColor: '#008000',
    display: 'flex',
    flexDirection: 'row',
    //borderRadius: 10,
    width: '90%',
    height: 80,
    borderRadius: 25,
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: 'white',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    //marginBottom: 2,
    //marginTop: 3,
    justifyContent: 'center'
  },
  picture: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    marginLeft: 10,
    // marginRight: 10,
    // marginTop: 10,
    borderRadius: 40,
    alignSelf: 'center'
  },
  spacer: {
    display: 'flex',
    flexGrow: 1
  },
  namePosition: {
    justifyContent: 'center',
    alignContent: 'center',
    position: 'static',
    marginRight: 18,
    color: 'white',
    fontFamily: 'Roboto_400Regular',
    fontSize: 15
    
  },
  scoreContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 50,
    margin: 100
  },
  studentAlignment: {
    alignItems: 'center',
    backgroundColor: 'white'
  },
  mainCointainer: {
    justifyContent: 'center',
    alignContent: 'center'
  }

})

const styles = StyleSheet.create({
 LeaderboardColor: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    alignContent: 'center',
    fontFamily: 'Roboto_900Black',
    alignSelf: 'center'
},
leaderboardContainer: {
  width: '100%',
  height: 60,
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  zIndex: 1,
  top: -1,
  marginBottom: 2
  
},
mainContainer: {  
  alignItems: 'stretch',
  display: 'flex',
  backgroundColor: 'green'
}

});
