import { Image, StyleSheet, Text, View, RefreshControl } from "react-native";
import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function LeaderboardScreen() {
  const [students, setStudents] = useState([]);
  const [topThree, setTopThree] = useState([]);
  const [others, setOthers] = useState([]);
  const [studentColors, setStudentColors] = useState({}); // State to store color mapping
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);

  const ENDPOINTS = {
    leaderboard: "students/leaderboard",
  };

  const backgroundColorOptions = [
    "#eae2e0", "#e5c8a5", "#a1d6cc", "#e3d0e0", "#8590c0",
    "#d9dad9", "#cfc3c3", "#a5ad9c", "#d3ddf6", "#baf9f9",
  ];

  const pullRefresh = () => {
    getStudents();

    setTimeout(() =>{
      setRefresh(false)
    }, 4000)
  }

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = () => {
    axios({
      method: "GET",
      url: ENDPOINTS.leaderboard,
    })
      .then((res) => {
        const students = res.data;
        setStudents(students);

        const sortedStudents = students.sort((a, b) => b.score - a.score);
        const topThree = sortedStudents.slice(0, 3);
        const others = sortedStudents.slice(3);
        setTopThree(topThree);
        setOthers(others);

        // Assign colors to students based on unique identifiers (e.g., ID or name)
        const colors = {};
        students.forEach((student) => {
          if (!colors[student.id]) {
            const randomIndex = Math.floor(Math.random() * backgroundColorOptions.length);
            colors[student.id] = backgroundColorOptions[randomIndex];
          }
        });
        setStudentColors(colors);
      })
      .catch((error) => console.error("Error fetching leaderboard data:", error));
  };

  return (
    <ScrollView style={{paddingTop:25}}
        refreshControl = {
          <RefreshControl
            refreshing = {refresh}
            onRefresh={() => pullRefresh()}
          />
        }>
      
      <View style={styles.leaderboardContainer}>
        <Text style={styles.LeaderboardColor}>LEADERBOARD</Text>
      </View>

      {!students ? (
        <View style={styles.loadingPosition}>
          <Image
            style={{ height: 400, width: 400 }}
            source={require("@/assets/images/loading.gif")}
          />
        </View>
      ) : (
        <>
          <View style={leaderboardStyle.topThreeContainer}>
            {topThree.map((student, index) => (
              <View
                key={index}
                style={[
                  leaderboardStyle.topThreeLayer,
                  index === 0
                    ? styles.gold
                    : index === 1
                    ? styles.silver
                    : index === 2
                    ? styles.bronze
                    : {},
                ]}
              >
                <View
                  style={[
                    leaderboardStyle.positionCircle,
                    index === 0
                      ? { borderColor: "gold" }
                      : index === 1
                      ? { borderColor: "silver" }
                      : index === 2
                      ? { borderColor: "#cd7f32" }
                      : { borderColor: "#008000" },
                  ]}
                >
                  <Text
                    style={[
                      leaderboardStyle.topThreePosition,
                      index === 0
                        ? styles.goldNumber
                        : index === 1
                        ? styles.silverNumber
                        : index === 2
                        ? styles.bronzeNumber
                        : {},
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View
                  style={[
                    leaderboardStyle.picture,
                    { backgroundColor: "#e2e2e2e2" },
                  ]}
                >
                  <Text style={leaderboardStyle.pictureInitial}>
                    {(student.first_name[0] + student.last_name[0]).toUpperCase()}
                  </Text>
                </View>
                <Text style={leaderboardStyle.topThreeName}>
                  {student.first_name}, {student.last_name}
                </Text>
                <Text style={leaderboardStyle.topThreeScore}>
                  {student.total_score}
                </Text>
              </View>
            ))}
          </View>

          <View>
            {others.map((student, index) => (
              <View key={index + 3} style={leaderboardStyle.studentAlignment}>
                <View style={leaderboardStyle.studentLayer}>
                  <View style={leaderboardStyle.positionCircle}>
                    <Text style={leaderboardStyle.topThreePosition}>
                      {index + 4}
                    </Text>
                  </View>
                  <View
                    style={[
                      leaderboardStyle.picture,
                      { backgroundColor: "#e2e2e2" },
                    ]}
                  >
                    <Text style={leaderboardStyle.pictureInitial}>
                      {(student.first_name[0] + student.last_name[0]).toUpperCase()}
                    </Text>
                  </View>
                  <View style={leaderboardStyle.spacer}></View>
                  <Text style={leaderboardStyle.namePosition}>
                    {student.first_name}, {student.last_name}
                  </Text>
                  <View style={leaderboardStyle.spacer}></View>
                  <Text style={leaderboardStyle.namePosition}>
                    {student.total_score}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </> 
      )}
    </ScrollView>
  );
}


const leaderboardStyle = StyleSheet.create({
  pictureInitial: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  picture: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    color: '#008000',
    marginRight: 10
  },
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  topThreeLayer: {
    borderRadius: 20,
    width: "28%",
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative",
  },
  positionCircle: {
    position: "absolute",
    left: -10,
    top: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#008000",
  },
  topThreePosition: {
    fontSize: 16,
    color: "#008000",
    fontWeight: "bold",
  },
  topThreeName: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    marginVertical: 5,
  },
  topThreeScore: {
    color: "#ffffff",
    fontSize: 14,
  },
  studentLayer: {
    backgroundColor: "#008000",
    flexDirection: "row",
    width: "90%",
    height: 80,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  spacer: {
    flexGrow: 1,
  },
  namePosition: {
    color: "#ffffff",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    alignSelf: "center",
  },
  studentAlignment: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  crownImage: {
    position: "absolute",
    top: -32,
    right: -8,
    width: 40,
    height: 40,
    zIndex: 1,
  },
});

const styles = StyleSheet.create({
  loadingPosition: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  LeaderboardColor: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 15,
    fontFamily: "Roboto_900Black",
  },
  leaderboardContainer: {
    width: "100%",
    height: 80,
    backgroundColor: "#008000",
    justifyContent: "center",
    position: "sticky",
    top: 0,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 10,
  },
  gold: {
    backgroundColor: "gold",
  },
  silver: {
    backgroundColor: "silver",
  },
  bronze: {
    backgroundColor: "#cd7f32",
  },
  goldNumber: {
    color: "gold",
    fontSize: 20,
    fontWeight: "bold",
  },
  silverNumber: {
    color: "silver",
    fontSize: 20,
    fontWeight: "bold",
  },
  bronzeNumber: {
    color: "#cd7f32",
    fontSize: 20,
    fontWeight: "bold",
  },
});