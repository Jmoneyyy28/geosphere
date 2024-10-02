import { Image, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native';

export default function LeaderboardScreen() {
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

const students = [
  {
    "name": "Sebastien",
    "score": 5
  },
  {
    "name": "Ivan",
    "score": 5
  },
  {
    "name": "Kim",
    "score": 5
  },
  {
    "name": "Walter",
    "score": 4
  },
  {
    "name": "Sebastien",
    "score": 5
  },
  {
    "name": "Ivan",
    "score": 5
  },
  {
    "name": "Kim",
    "score": 5
  },
  {
    "name": "Walter",
    "score": 4
  },
  {
    "name": "Sebastien",
    "score": 5
  },
  {
    "name": "Ivan",
    "score": 5
  },
  {
    "name": "Kim",
    "score": 5
  },
  {
    "name": "Walter",
    "score": 4
  },
  {
    "name": "Sebastien",
    "score": 5
  },
  {
    "name": "Ivan",
    "score": 5
  },
  {
    "name": "Kim",
    "score": 5
  },
  {
    "name": "Walter",
    "score": 4
  }
]

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
    fontFamily: 'sans-serif'
    
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
    fontFamily: 'sans-serif',
    alignSelf: 'center'
},
leaderboardContainer: {
  width: '100%',
  height: 60,
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
  // borderStyle: 'solid',
  // borderWidth: 2,
  // borderColor: 'red',
  // borderTopWidth: 0,
  // borderLeftWidth: 0,
  // borderRightWidth: 0,
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
