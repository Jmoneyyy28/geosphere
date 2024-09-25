import { Image, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      {
        students.map((student) => {
          return <View>
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
    </ParallaxScrollView>
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
  }
]

const leaderboardStyle = StyleSheet.create({
  studentLayer: {
    backgroundColor: 'green',
    display: 'flex',
    borderRadius: 50,
    width: 350,
    height: 70,
  },
  picture: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 18,
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
 }
})

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
