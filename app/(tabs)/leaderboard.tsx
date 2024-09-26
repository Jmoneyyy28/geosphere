import { Image, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  return (
    <ScrollView>
    <View style={styles.leaderboardContainer}>
       <Text style={styles.LeaderboardColor}>Leaderboard</Text>
     </View>
    <View>
       {
        students.map((student) => {
          return <View style={leaderboardStyle.studentAlignment}>
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
    backgroundColor: 'green',
    display: 'flex',
    flexDirection: 'row',
    //borderRadius: 10,
    width: 410,
    height: 60,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 2,
    marginTop: 3,
    justifyContent: 'center'
  },
  picture: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 40
  },
  spacer: {
    display: 'flex',
    flexGrow: 1
  },
  namePosition: {
    justifyContent: 'center',
    alignContent: 'center',
    position: 'static',
    marginRight: 18
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
  alignItems: 'center'
}

})

const styles = StyleSheet.create({
 LeaderboardColor: {
    color: '#ff000',
    fontSize: 30,
    fontWeight: 'bold',
    alignContent: 'center'
},
leaderboardContainer: {
  width: 440,
  height: 50,
  backgroundColor: '#84b522',
  alignItems: 'center',
  justifyContent: 'center',
  borderStyle: 'solid',
  borderWidth: 1,
  position: 'sticky',
  zIndex: 1,
  top: 0,
  
},
mainContainer: {
  alignItems: 'stretch',
  display: 'flex',
}

});
