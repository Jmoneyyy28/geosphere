import { Image, StyleSheet, View, Text, ScrollView, TextInput } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GeoButton } from "@/components/GeoButton";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { StorageService } from "@/services/StorageService";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINTS = {
  topics: "topics",
  badges: "badges",
  feedback: "feedback",
  studentMap: "students/studentmap",
  saveStudentMap: "students/savestudentmap",
  studentList: "students/studentfeedback",
  teacherFeedback: "feedback/teacherFeedback"
};

const STUDENT_SEGMENT_BUTTONS = [
  {
    name: "Lessons",
    isActive: true,
  },
  {
    name: "Badges",
    isActive: false,
  },
  {
    name: "Feedback",
    isActive: false,
  },
];

const TEACHER_SEGMENT_BUTTONS = [
  {
    name: "Lessons",
    isActive: true,
  },
  {
    name: "Students",
    isActive: false,
  },
  {
    name: "Feedback",
    isActive: false,
  },
];
const BADGE_LOCK = "https://i.imgur.com/ZJS5FQJ.png";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [topics, setTopics] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [segmentButtons, setSegmentButtons] = useState(null);
  const [students, setStudents] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
    //teacher variables
  const [pickedStudents, setPickedStudents] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [feedback, setFeedback] = React.useState('');
  //student feedback text
  const [feedbacktext, setfeedbacktext] = React.useState({});

  const save = (teacher_id, student_ids) => {
    axios({
      url: ENDPOINTS.saveStudentMap,
      method: "post",
      data: {
        teacher_id: teacher_id,
        student_ids: student_ids,
      },
    }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    getProfile();
    getTopics();
    getBadges();
  }, []);

  useEffect(() => {
    if (profile) {
      getFeedbacks();
      if (profile.isTeacher) {
        setSegmentButtons(TEACHER_SEGMENT_BUTTONS);
        getStudents();
        setPickedStudents([]);
        getStudentFeedbackList(profile.id);
      } else {
        setSegmentButtons(STUDENT_SEGMENT_BUTTONS);
      }
    }
  }, [profile]);

  const postFeedback = (teacher_id, student_id, feedback) => {
    axios({
      url: ENDPOINTS.teacherFeedback,
      method: "post",
      data: {
        teacher_id: teacher_id,
        student_id: student_id,
        feedback: feedback
      },
    }).then();
  };

  const getStudentFeedbackList =  (teacher_id) => {
    axios({
      url: ENDPOINTS.studentList,
      method: "get",
      params: {
        teacher_id: teacher_id
      },
    }).then((res) => {
      const studentList = res.data;
      setStudentList(res.data);
      console.log(res);
      const tempFeedbackText = structuredClone(feedbacktext);
      res.data.map((student) => {
        tempFeedbackText[student.id] = "";
      });
      setfeedbacktext(tempFeedbackText);
      console.log(feedbacktext)
    });
  };

  const getProfile = () => {
    StorageService.getData("profile").then((profile) => {
      if (profile) {
        setProfile(profile);
      } else {
        router.replace("/login");
      }
    });
  };

  const getStudents = () => {
    axios({
      method: "get",
      params: {
        teacher_id: profile.id,
      },
      url: ENDPOINTS.studentMap
    }).then((res) => {
      const students = res.data;
      setStudents(res.data);
      setLoadingStudents(false);
      console.log(res);
    })
    .catch(() => {
      setLoadingStudents(false);
    });
  };

  const getTopics = () => {
    axios({
      method: "get",
      url: ENDPOINTS.topics,
    })
      .then((res) => {
        console.log(res.data);
        setTopics(res.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  };

  const getBadges = () => {
    axios({
      method: "get",
      url: ENDPOINTS.badges,
    })
      .then((res) => {
        console.log(res.data);
        setBadges(res.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  };

  const getFeedbacks = () => {
    axios({
      method: "get",
      url: ENDPOINTS.feedback,
      params: {
        student_id: profile.id,
      },
    })
      .then((res) => {
        console.log(res.data);
        setFeedbacks(res.data);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
      });
  };

  const openLesson = (topic_id) => {
    router.replace({ pathname: "/lesson", params: { topic_id: topic_id } });
  };

  const getBadge = (badge) => {
    if (badge.score > 75) {
      return badge.images.gold;
    } else if (badge.score > 50) {
      return badge.images.silver;
    } else {
      return badge.images.bronze;
    }
  };

  const onChangeFeedback = (student_id, feedback) => {
    const tempFeedbackText = structuredClone(feedbacktext);

    tempFeedbackText[student_id] = feedback;

    setfeedbacktext(tempFeedbackText);
    console.log(feedbacktext)
  }

  const signOut = () => {
    StorageService.storeData("profile", null);
    router.replace("/login");
  };

  const plateTectonicScreen = () => {
    router.replace("/");
  };

  const leaderboardScreen = () => {
    router.replace("/leaderboard");
  };

  const openFeedback = (id) => {
    console.log(id);
    router.push(`/feedback/${id}`);
  };

  const updateView = (name) => {
    const updatedButtons = [];

    segmentButtons?.map((button) => {
      const temp = { ...button };
      temp.isActive = temp.name == name;

      updatedButtons.push(temp);
    });

    setSegmentButtons(updatedButtons);
  };

  const checkStudent = (isChecked, id) => {
    const tempPickedStudents = structuredClone(pickedStudents);

    const index = tempPickedStudents.indexOf(id);

    if (index > -1 && !isChecked) {
      tempPickedStudents.splice(index, 1);
    } else if (index < 0 && isChecked) {
      tempPickedStudents.push(id);
    }

    console.log(tempPickedStudents);
    setPickedStudents(tempPickedStudents);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profilePicture}
            source={require("@/assets/images/profile-male.png")}
          />

          <Text style={styles.name}>
            Welcome, {profile?.first_name} {profile?.last_name}!
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.headerButtons}>
          <GeoButton onPress={signOut} theme="transparent">
            <Ionicons name="log-out-outline" style={styles.signOutIcon} />
          </GeoButton>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.segmentButtons}>
          {segmentButtons?.map((button) => {
            return (
              <GeoButton
                style={styles.segmentButton}
                theme="transparent"
                name={button.name}
                isActive={button.isActive}
                onPress={() => updateView(button.name)}
              />
            );
          })}
        </View>

        {segmentButtons?.map((segment) => {
         if (segment.name == "Lessons" && segment.isActive) {
          return topics.length === 0 ? (
            <View style={styles.segmentContainer}>
              <Image
                style={{ height: 400, width: 400 }}
                source={require("@/assets/images/loading.gif")}
              />
            </View>
          ) : (
            <View style={styles.segmentContainer}>
              {topics.map((topic) => {
                return (
                  <GeoButton
                    style={styles.plateTectonicButton}
                    textStyle={styles.textColor}
                    onPress={() => openLesson(topic.id)}
                    key={topic.id}
                  >
                    <View style={styles.test}>
                      <View style={styles.textContentContainer}>
                        <Text style={styles.topicText}>{topic.topic_name}</Text>
                        <Text style={styles.bodyText}>
                          {topic.topic_description}
                        </Text>
                      </View>
                    </View>
                  </GeoButton>
                );
              })}
            </View>
          );
          } else if (segment.name == "Badges" && segment.isActive) {
            return (
              <ScrollView>
                <View style={styles.segmentContainer}>
                  {badges.map((badge) => {
                    return (
                      <View style={styles.badgeContainer}>
                        <Image
                          style={styles.badgeImage}
                          source={badge.badge_gold}
                        />
                        <Text style={styles.badgeName}>{badge.badge_name}</Text>
                        <Text style={styles.badgeDescription}>
                          {badge.badge_description}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            );
          } else if (
            segment.name == "Feedback" &&
            !profile.isTeacher &&
            segment.isActive
          ) {
            return (
              <ScrollView>
                <View style={styles.segmentContainer}>
                  {feedbacks.map((feedback) => {
                    return (
                      <View style={styles.descriptionContainer}>
                        <View style={styles.teacherName}>
                          <Image
                            style={styles.feedbackStyle}
                            source={require("@/assets/images/profile-male.png")}
                          />
                          <Text style={styles.teacherName}>
                            {feedback.first_name} {feedback.last_name}
                          </Text>
                        </View>
                        <View style={styles.contentText}>
                          <Text style={styles.topicText2}>
                            {feedback.quiz_title}
                          </Text>
                          <Text style={styles.lessonText}>
                            {feedback.feedback}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            );
          } else if (segment.name == "Students" && segment.isActive) {
            return (
              <ScrollView>
                {loadingStudents ? (
                  <View style={styles.loadingContainer}>
                    <Image
                      style={{ height: 400, width: 400 }}
                      source={require("@/assets/images/loading.gif")}
                    />
                  </View>
                ) : (
                  <View style={styles.studentsSegmentContainer}>
                    {students?.map((student) => {
                      return (
                        <BouncyCheckbox
                          size={25}
                          fillColor="#008000"
                          unFillColor="#ffffff"
                          text={`${student.first_name} ${student.last_name}_${student.id_number}`}
                          iconStyle={{ borderColor: "red" }}
                          innerIconStyle={{ borderWidth: 2 }}
                          onPress={(isChecked) => checkStudent(isChecked, student.id)}
                          style={styles.studentsCheckbox}
                        />
                      );
                    })}
                    <GeoButton
                      onPress={() => save(profile.id, pickedStudents)}
                      style={styles.saveButton}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </GeoButton>
                  </View>
                )}
              </ScrollView>
            );

          }else if (
            segment.name == "Feedback" &&
            profile.isTeacher &&
            segment.isActive
          ) {
            return <ScrollView>
                    <View style={styles.studentsSegmentContainer}>
                        {studentList?.map((student) => 
                        <Text
                            style={styles.studentListFont}>
                            {student.first_name + " " + student.last_name + "_" + student.id_number}
                                <TextInput
                                      style={styles.feedbackborderUnderline}
                                      placeholder="feedback"
                                      onChangeText={(text) => onChangeFeedback(student.id, text)}
                                      value={feedbacktext[student.id]}
                                      placeholderTextColor={"#000000"}
                                />
                                    <GeoButton 
                                        style={styles.feedbackSaveButton}
                                        onPress={ () => postFeedback(profile.id,student.id,'test')}>
                                        <Text style={styles.saveButtonText}>Save</Text>
                                    </GeoButton>
                        </Text>
                        )}
                    </View>
                  </ScrollView>;
          }
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  feedbackSaveButton: {
    backgroundColor: "#008000",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 5,
    float: 'right'
  },
  feedbackborderUnderline: {
    borderWidth: 1,
    borderColor: "#000000",
    width: '100%',
    height: 60,
    margin: 5,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor:"#ffffff",

  },
  studentListFont: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    marginBottom: 15
  },
  studentsSegmentContainer: {
    alignSelf: 'center',
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '90%',
    flex: 1
},
 studentsCheckbox: {
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
 saveButton: {
    backgroundColor: "#008000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
 saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16
  },
  studentsButton: {
    backgroundColor: "#4CAF50", // Distinct green color
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: "#388E3C",
    alignItems: "center",
    justifyContent: "center",
  },
  studentsButtonText: {
    color: "#FFFFFF", // White text
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Roboto_300Light",
    zIndex: 2, // layer
    marginTop: 5, // space of text and topic
  },
  textContentContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "baseline",
    //marginLeft: 1, // Space between the image and text
    maxWidth: "95%",
    zIndex: 2, // text layer
    position: "absolute",
    marginTop: 10,
  },
  test: {
    flex: 1,
    width: "90%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    //paddingHorizontal: 10, // Add padding on the sides
  },
  topicText2: {
    fontFamily: "Roboto_500Medium",
    //fontWeight: 'bold'
  },
  teacherName: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontFamily: "Roboto_100Thin",
  },
  contentText: {
    marginTop: 10,
  },
  descriptionContainer: {
    flexDirection: "column",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 25,
    padding: 25,
    width: 350,
    shadowColor: "#212121",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    flexShrink: 1,
  },
  feedbackStyle: {
    width: 35,
    height: 35,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: "#e0e0e0",
    //justifyContent: 'center',
    alignItems: "baseline",
  },
  topicText: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Roboto_500Medium",
    zIndex: 2, // topic layer
  },
  scrollView: {
    flex: 1, // Allow scrollable content to fill remaining space
  },
  lessonText: {
    fontSize: 14, // Slightly smaller size for body text
    textAlign: "justify", // Justify the text
    marginTop: 5,
  },
  plateTectonicButton: {
    backgroundColor: "#008000",
    borderRadius: 5,
    width: "90%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0.2, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginTop: 20,
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    padding: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 65,
  },
  headerButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    display: "flex",
    flex: 1,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Roboto_100Thin",
  },
  signOutIcon: {
    color: "#9e9e9e",
    fontSize: 25,
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
  },
  segmentButtons: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#EAEAEA",
    padding: 1,
    margin: 15,
    borderRadius: 5,
  },
  segmentButton: {
    flex: 1,
    height: 25,
    borderRadius: 5,
  },
  segmentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  badgeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 25,
    padding: 25,
    height: 320,
    width: 250,
    shadowColor: "#212121",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 50,
  },
  badgeImage: {
    width: 200,
    height: 200,
  },
  badgeName: {
    color: "#212121",
    fontSize: 24,
    fontFamily: "Roboto_500Medium",
  },
  badgeDescription: {
    marginTop: 5,
    color: "#212121",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Roboto_300Light",
  },

  dashboardContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  platetectonicButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    width: 350,
    height: 100,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0.2, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginTop: 55,
    // borderStyle: 'solid',
    // borderWidth: 1,
    //marginLeft: 5,
  },
  feedbackButton: {
    width: 350,
    height: 55,
    marginTop: 15,
    // borderStyle: 'solid',
    // borderWidth: 1,
  },
  textColor: {
    color: "white",
    //fontWeight: 'condensed',
    fontSize: 30,
    textAlign: "center",
  },
  // New container for horizontal layout
  horizontalContainer: {
    flexDirection: "row",
    marginTop: 20, // Spacing between the Plate Tectonic button and this container
    justifyContent: "space-between",
    width: 350, // Match the width of Plate Tectonic Topics button
  },
  leaderboardButton: {
    backgroundColor: "#ffd700",
    borderRadius: 20,
    width: 130, // Adjusted width for side-by-side layout
    height: 120,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0.2, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // borderStyle: 'solid',
    // borderWidth: 1,
  },
  badges: {
    display: "flex",
    flexDirection: "row",
  },
  signoutButton: {
    width: 250,
    height: 45,
    marginTop: 60,
  },
  signoutText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});