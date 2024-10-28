import { Image, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import crownImage from '@/assets/images/crown.png'; 
import { useEffect, useState } from 'react';
import axios from "axios";

export default function LeaderboardScreen() {
  const [topThree, setTopThree] = useState([]);
  const [others, setOthers] = useState([]);
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

        const sortedStudents = students.sort((a, b) => b.score - a.score);
        const topThree = sortedStudents.slice(0, 3);
        const others = sortedStudents.slice(3);
        setTopThree(topThree);
        setOthers(others);
      })
  }

  return (
    <ScrollView>
      <View style={styles.leaderboardContainer}>
        <Text style={styles.LeaderboardColor}>LEADERBOARD</Text>
      </View>

      {/* Top 3 Students Section */}
      <View style={leaderboardStyle.topThreeContainer}>
        {
          topThree.map((student, index) => (
            <View key={index} style={[leaderboardStyle.topThreeLayer, 
              index === 0 ? styles.gold : 
              index === 1 ? styles.silver : 
              index === 2 ? styles.bronze : {}]}>
              
              {/* Image for the top player */}
              {index === 0 && (
                <Image  
                  source={crownImage} 
                  style={leaderboardStyle.crownImage} 
                />
              )}

              {/* Circle position for top players */}
              <View style={[leaderboardStyle.positionCircle, 
                index === 0 ? { borderColor: 'gold' } : 
                index === 1 ? { borderColor: 'silver' } : 
                index === 2 ? { borderColor: '#cd7f32' } : 
                { borderColor: '#008000' }]}>
                <Text style={[leaderboardStyle.topThreePosition, 
                  index === 0 ? styles.goldNumber : 
                  index === 1 ? styles.silverNumber : 
                  index === 2 ? styles.bronzeNumber : {}]}>
                  {index + 1}
                </Text>
              </View>
              <View style={leaderboardStyle.picture}></View>
              <Text style={leaderboardStyle.topThreeName}>{student.name}</Text>
              <Text style={leaderboardStyle.topThreeScore}>{student.score}</Text>
            </View>
          ))
        }
      </View>

      {/* Main Leaderboard */}
      <View>
        {
          others.map((student, index) => (
            <View key={index + 3} style={leaderboardStyle.studentAlignment}>
              <View style={leaderboardStyle.studentLayer}>
                <View style={leaderboardStyle.positionCircle}>
                  <Text style={leaderboardStyle.topThreePosition}>{index + 4}</Text>
                </View>
                <View style={leaderboardStyle.picture}></View>
                <View style={leaderboardStyle.spacer}></View>
                <Text style={leaderboardStyle.namePosition}>{student.name}</Text>
                <View style={leaderboardStyle.spacer}></View>
                <Text style={leaderboardStyle.namePosition}>{student.score}</Text>
              </View>
            </View>
          ))
        }
      </View>
    </ScrollView>
  );
}


const leaderboardStyle = StyleSheet.create({
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  topThreeLayer: {
    borderRadius: 20,
    width: '28%',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative', 
  },
  positionCircle: {
    position: 'absolute',
    left: -10, 
    top: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#008000',
  },
  topThreePosition: {
    fontSize: 16,
    color: '#008000', 
    fontWeight: 'bold',
  },
  topThreeName: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    marginVertical: 5,
  },
  topThreeScore: {
    color: '#ffffff',
    fontSize: 14,
  },
  studentLayer: {
    backgroundColor: '#008000',
    flexDirection: 'row',
    width: '90%',
    height: 80,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  picture: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignSelf: 'center',
  },
  spacer: {
    flexGrow: 1,
  },
  namePosition: {
    color: '#ffffff',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    alignSelf: 'center',
  },
  studentAlignment: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  crownImage: {
    position: 'absolute',
    top: -32, 
    right: -8, 
    width: 40, 
    height: 40, 
    zIndex: 1, 
  },
});

const styles = StyleSheet.create({
  LeaderboardColor: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 15,
    fontFamily: 'Roboto_900Black',
  },
  leaderboardContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#008000',
    justifyContent: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  gold: {
    backgroundColor: 'gold',
  },
  silver: {
    backgroundColor: 'silver',
  },
  bronze: {
    backgroundColor: '#cd7f32', 
  },
  goldNumber: {
    color: 'gold',
    fontSize: 20,
    fontWeight: 'bold',
  },
  silverNumber: {
    color: 'silver',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bronzeNumber: {
    color: '#cd7f32', 
    fontSize: 20,
    fontWeight: 'bold',
  },
});
