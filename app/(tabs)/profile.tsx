import { Image, StyleSheet, View, Text, ScrollView, TextInput, Alert } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GeoButton } from "@/components/GeoButton";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { StorageService } from "@/services/StorageService";
import * as Progress from 'react-native-progress';

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINTS = {
  topics: "topics",
  badges: "badges",
  feedback: "feedback",
  studentMap: "students/studentmap",
  saveStudentMap: "students/savestudentmap",
  studentList: "students/studentfeedback",
  teacherFeedback: "feedback/teacherFeedback",
  score: "topics/score"
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
  const [studentList, setStudentList] = useState(null);
  const [feedback, setFeedback] = React.useState('');
  //student feedback text
  const [feedbacktext, setfeedbacktext] = React.useState({});
  // check if profile is teacher or student
  const [profileDisplay, setProfileDisplay] = useState(null);
  //get score from student
  const [scores, setScores] = useState([]);


  const save = (teacher_id, student_ids) => {
    if (student_ids.length == 0){
      alert('noStudentSelected')
    }else{
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
    }
    
  };

  useEffect(() => {
    getProfile();
    getTopics();
    getBadges();
  }, []);

  useEffect(() => {
    if (profile) {
      getFeedbacks();
      getSCore();
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

  const getSCore = () => {
    axios({
      method: "get",
      url: ENDPOINTS.score,
      params:{
        student_id: profile.id,
      },
    })
      .then((res) => {
        setScores(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching scores:", error);
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

  const test = (badge) => {
    if (badge.score > 75) {
      return badge.images.gold;
    } else if (badge.score > 50) {
      return badge.images.silver;
    } else {
      return badge.images.bronze;
    }
  };

  const getBadgeLevel = (badge, score) => {
    console.log("SCORE:", score);

    if (score == null) {
      return BADGE_LOCK;
    }

    if (score > 75) {
      return badge.badge_gold;
    } else if (score > 50) {
      return badge.badge_silver;
    } else {
      return badge.badge_bronze;
    }
  }

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

  const backgroundColor = ['#eae2e0', '#e5c8a5', '#a1d6cc', '#e3d0e0', '#8590c0', '#d9dad9', '#cfc3c3', '#a5ad9c', '#d3ddf6', '#baf9f9'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
              <View style={[styles.picture, { backgroundColor: "#e2e2e2" },]}>
                    <Text style={styles.pictureInitial}>{(profile?.first_name[0].toUpperCase() + profile?.last_name[0].toUpperCase())}</Text>
              </View>

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
              
          <View style={styles.progressBar}>
                      {profile && !profile.isTeacher && (
                        <>
                          <Progress.Bar
                            progress={0.7}
                            width={300}
                            height={25}
                            color="#008000"
                            borderColor="#ffffff"
                            unfilledColor="#d3d3d3"
                            borderRadius={25}
                          />
                          <Text style={styles.completedTask}>Completed Task</Text>
                          <View style={styles.progressContainer}>
                            <View style={styles.doneColor}></View>
                            <Text style={styles.progressDescription}>Done</Text>
                            <View style={styles.pendingColor}></View>
                            <Text style={styles.progressDescription}>Pending</Text>
                          </View>
                        </>
                      )}
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
                    return scores.map((score) => {
                      if (badge.badge_name == score.topic_name) {
                        return (
                          <View style={styles.badgeContainer}>
                            <Image style={styles.badgeImage} source={getBadgeLevel(badge, score.score)}/>
                            <Text style={styles.badgeName}>{badge.badge_name}</Text>
                            <Text style={styles.badgeDescription}>{badge.badge_description}</Text>
                          </View>
                        )
                      } else {
                        return null;
                      }
                    });

                    // return (
                    //   <View style={styles.badgeContainer}>
                    //     <Image
                    //       style={styles.badgeImage}
                    //       source={badge.badge_gold}
                    //     />
                    //     <Text style={styles.badgeName}>{badge.badge_name}</Text>
                    //     <Text style={styles.badgeDescription}>
                    //       {badge.badge_description}
                    //     </Text>
                    //   </View>
                    // );
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
                          <View style={[styles.picture, { backgroundColor: "#e2e2e2" }]}>
                                <Text style={styles.pictureInitial}>{(feedback.first_name[0] + feedback.last_name[0]).toUpperCase()}</Text>
                            </View>
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
                {!students ? (
                  <View style={styles.loadingContainer}>
                    <Image
                      style={{ height: 400, width: 400 }}
                      source={require("@/assets/images/loading.gif")}
                    />
                  </View>
                ) : (
                    <View style={styles.studentsSegmentContainer}>
                      <View style={styles.studentIconContainer}>
                          <Ionicons name="people" style={styles.studentIcon} />
                          <Text style={styles.studentListText}> List of Students: {students.length}</Text>
                      </View>
                    {students?.map((student) => {
                      return (
                        <View style={styles.studentsChecklistContainer}>       
                            <View style={[styles.picture, { backgroundColor: "#e2e2e2" }]}>
                                <Text style={styles.pictureInitial}>{(student.first_name[0] + student.last_name[0]).toUpperCase()}</Text>
                            </View>
                                <Text style={styles.studentNameText}>{`${student.first_name} ${student.last_name}_${student.id_number}`}</Text>
                                <BouncyCheckbox
                                  size={20}
                                  fillColor="#008000"
                                  unFillColor="#ffffff"
                                  iconStyle={{ borderColor: "red" }}
                                  innerIconStyle={{ borderWidth: 2 }}
                                  onPress={(isChecked) => checkStudent(isChecked, student.id)}
                                  style={styles.studentsCheckbox}
                                />
                        </View>
                        
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
            return (
              <ScrollView>
                {
                  !studentList ? (
                    <View style={styles.loadingContainer}>
                      <Image
                        style={{ height: 400, width: 400 }}
                        source={require("@/assets/images/loading.gif")}
                      />
                    </View>
                  ) : (
                    <View style={styles.studentsSegmentContainer}>
                         <View style={styles.studentIconContainer}>
                          <Ionicons name="chatbubbles" theme = "transparent" style={styles.studentIcon} />
                          <Text style={styles.studentListText}> Give Feedback to {studentList.length} Students</Text>
                      </View>
                      {
                        studentList?.map((student) => {
                          <View style={styles.studentIconContainer}>
                      </View>
                          return (
                            
                            <View style={styles.studentsSegmentContainer}>
                              <View style={styles.studentNameFeedbackContainer}>
                                    <View style={[styles.picture, { backgroundColor: "#e2e2e2" }]}>
                                      <Text style={styles.pictureInitial}>{(student.first_name[0] + student.last_name[0]).toUpperCase()}</Text>
                                    </View>
                                      <Text style={styles.studentListFont}>{student.first_name + " " + student.last_name + "_" + student.id_number}</Text>
                              </View>
                                  <View style={styles.studentProgressContainer}>
                                          <Progress.Bar
                                              progress={0.7}
                                              width={200}
                                              height={10}
                                              color="#008000"
                                              borderColor="#ffffff"
                                              unfilledColor="#d3d3d3"
                                              borderRadius={25}
                                          />
                                            <Text>Student Progress</Text>
                                  </View>
                              <TextInput
                                style={styles.feedbackborderUnderline}
                                placeholder="feedback"
                                onChangeText={(text) => onChangeFeedback(student.id, text)}
                                value={feedbacktext[student.id]}
                                placeholderTextColor={"#808080"}
                              />
                              <GeoButton
                                style={styles.feedbackSaveButton}
                                onPress={ () => postFeedback(profile.id, student.id, feedbacktext[student.id])}>
                                  <Text style={styles.saveButtonText}>Save</Text>
                              </GeoButton>
                            </View>
                          )
                        })
                      }
                    </View>
                  )}
              </ScrollView>
            )
          }
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  studentProgressContainer: { 
    margin: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50
  },
  completedTask: {
    fontFamily: "Roboto_300Light",
    fontSize: 13,
    marginTop: 10,
    color: "#636363",
    marginBottom: 10
  },
  progressDescription: {
    fontFamily: "Roboto_300Light",
    fontSize: 13,
  },
  pendingColor: {
    backgroundColor: "#d3d3d3",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 15
  },
  progressContainer: { 
    margin: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  doneColor: {
    backgroundColor: "#008000",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5
  },
  progressBar: {
    alignItems: 'center',
    margin: 10
  },
  studentNameText: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
  },
  studentNameFeedbackContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  studentListText: {
    fontSize: 20,
    fontFamily: 'Roboto_400Regular'
  },
  studentIconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },
  studentIcon: {
    fontSize: 45,
    color: "#008000"
  },
  studentsChecklistContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderColor: '#000000',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5
  },
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
  },
  feedbackborderUnderline: {
    borderWidth: 1,
    borderColor: "#000000",
    width: '100%',
    height: 60,
    margin: 5,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingLeft: 5, // Adds margin for the placeholder
    textAlign: 'left', // Ensures text starts at the left

  },
  studentListFont: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular"
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
    position: 'absolute',
    left: '90%'
    
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