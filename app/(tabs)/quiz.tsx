import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import axios from "axios";
import { GeoButton } from "@/components/GeoButton";
import { StorageService } from "@/services/StorageService";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import structuredClone from "@ungap/structured-clone";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

const quizTime = 120;

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINTS = {
  quiz: "topics/quiz",
  questions: "topics/question",
  score: "topics/quiz",
  progress: "topics/progress",
};

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [remainingTime, setRemainingTime] = useState(quizTime);
  const [questionScore, setquestionScore] = useState(0);
  const [finalRemainingTime, setFinalRemainingTime] = useState(0);
  const router = useRouter();
  const navigation = useNavigation();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isStartModalVisible, setIsStartModalVisible] = React.useState(false);
  const [isScoreModalVisible, setIsScoreModalVisible] = React.useState(false);

  // useEffect(() => {

  // }, [questions]);

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setRemainingTime((previousTimer) => {
          if (previousTimer <= 1) {
            clearInterval(timer);
            return 0;
          }
          return previousTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  useEffect(() => {
    setLoading(true);
    getQuiz();
    getProfile();
    setRemainingTime(quizTime);
  }, [params.lesson_id]);

  useEffect(() => {
    if (quiz) {
      getQuestions();
    }
  }, [quiz]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setRemainingTime(quizTime);
      };
    }, [])
  );

  const getProfile = () => {
    StorageService.getData("profile").then((profile) => {
      if (profile) {
        setProfile(profile);
      }
    });
  };

  const getQuiz = () => {
    axios({
      url: ENDPOINTS.quiz,
      method: "get",
      params: { lesson_id: params.lesson_id },
    }).then((res) => {
      console.log(res.data);
      setQuiz(res.data[0]);
    });
  };

  const startTimer = () => {
    const test = setInterval(() => {
      setRemainingTime((previousTimer) => previousTimer - 1);
    }, 1000);

    // return () => clearInterval(test);
  }

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const postProgress = (student_id, progressName, topic_id) => {
    if (profile.isTeacher) {
      return;
    }
    axios({
      url: ENDPOINTS.progress,
      method: "post",
      data: {
        student_id: student_id,
        progressName: progressName,
        topic_id: topic_id,
      },
    }).then((res) => console.log("Progress Success"));
  };

  const getQuestions = () => {
    setLoading(true); // Start loading questions
    axios({
      url: ENDPOINTS.questions,
      method: "get",
      params: { quiz_id: quiz.id },
    })
      .then((res) => {
        setQuestions(res.data);
      })
      .finally(() => {
        setLoading(false); // End loading questions
        setIsStartModalVisible(true);
      });
  };
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const submit = () => {
    let tempScore = 0;
    for (let [key, value] of Object.entries(selectedAnswers)) {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].id == key && questions[i].answer == value) {
          tempScore += 10;
        }
      }
    }
    const totalScore = tempScore + remainingTime / 2;
    setFinalRemainingTime(quizTime - remainingTime);
    setquestionScore(tempScore);
    setScore(totalScore);
    postScore(profile.id, quiz.id, totalScore);
    setIsScoreModalVisible(true); // Show the score modal
    console.log(tempScore + remainingTime / 2)
    console.log(tempScore);
  };

  const postScore = (student_id, quiz_id, score) => {
    axios({
      url: ENDPOINTS.score,
      method: "post",
      data: {
        student_id: student_id,
        quiz_id: quiz_id,
        score: score,
      },
    }).then(showModalSuccess);
  };

  const showModalSuccess = () => {
    postProgress(profile.id, "quiz", params.topic_id);
    setIsScoreModalVisible(true); // Show the score modal
  };

  const handleSelectAnswer = (questionId, choice) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const isCorrectChoice = (question, choice) => question.answer === choice;

  const startQuiz = () => {
    setIsStartModalVisible(false); // Hide the start modal
    setIsTimerRunning(true); // Start the timer
  };

  const learnMore = () => {
    setIsModalVisible(false);
    router.replace("/leaderboard");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "(tabs)",
            params: {
              screen: "leaderboard",
            },
          },
        ],
      })
    );
  };
  const backToHome = () => {
    setIsModalVisible(false);
    router.replace("/");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "(tabs)",
            params: {
              screen: "",
            },
          },
        ],
      })
    );
  };
  const backQuiz = () => {
    router.replace("/");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "(tabs)",
            params: {
              screen: "",
            },
          },
        ],
      })
    );
  };

  //const totalScore = 10 * questions.length;

  return (
    <ScrollView style={styles.container}>
      {quiz === null ? (
        <View style={styles.loadingContainer}>
          <Image
            source={require("@/assets/images/loading.gif")}
            style={styles.loadingImage}
          />
        </View>
      ) : (
        <>
          <View style={styles.backButtonContainer}>
            <GeoButton onPress={backQuiz} theme="transparent">
              <Ionicons name="arrow-back" style={styles.backIcon} />
            </GeoButton>
          </View>
          <Text style={styles.quizTitle}>{quiz.quiz_title}</Text>
          <Text style={styles.questionTitle}>{questions.length} Questions</Text>
          <View style={styles.timerContainer}>
            <Ionicons name="timer-outline" style ={styles.timerStyle} /> 
            <Text style={styles.timerText}>{formatTimer(remainingTime)}</Text>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Image
                source={require("@/assets/images/loading.gif")}
                style={styles.loadingImage}
              />
            </View>
          ) : (
            <View style={styles.questionsContainer}>
              {questions.map((question, index) => (
                <View key={question.id} style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>
                    Question: {index + 1}/{questions.length}
                  </Text>
                  <Text style={styles.questionText}>{question.question}</Text>
                  <View style={styles.choicesContainer}>
                    {["choice_a", "choice_b", "choice_c", "choice_d"].map(
                      (choiceKey) => {
                        const choice = question[choiceKey];
                        const isSelected =
                          selectedAnswers[question.id] === choice;
                        const isCorrect = isCorrectChoice(question, choice);

                        const buttonStyle = isSelected
                          ? isCorrect
                            ? styles.selectedCorrectChoice
                            : styles.selectedWrongChoice
                          : styles.choiceButton;

                        return (
                          <GeoButton
                            key={choiceKey}
                            style={buttonStyle}
                            onPress={() =>
                              handleSelectAnswer(question.id, choice)
                            }
                          >
                            <Text style={styles.choiceText}>{choice}</Text>
                          </GeoButton>
                        );
                      }
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
          {!loading && (
            <View style={{ paddingBottom: 25 }}>
              <GeoButton style={styles.submitButton} onPress={() => submit()}>
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </GeoButton>
            </View>
          )}
          <Modal isVisible={isScoreModalVisible}>
            <View style={styles.modalContainer}>
              <Text style={styles.startboldText}>
                Final Score: {Math.round(score)} {"\n"}
                Question Score: {questionScore} {"\n"}
                Time: {formatTimer(finalRemainingTime)}
              </Text>
              <GeoButton
                name="See Leaderboard"
                onPress={learnMore}
                style={styles.learnButton}
              />
              <GeoButton
                name="Back to Home"
                onPress={backToHome}
                style={styles.learnButton}
              />
            </View>
          </Modal>
          <Modal isVisible={isStartModalVisible}>
            <View style={styles.startModal}>
              <Text style={styles.startboldText}>
                Welcome to the Ultimate Plate Tectonics Quiz Challenge! 🌍✨
              </Text>
              <Text style={styles.startText}>Here's how the game works:</Text>
              <Text style={styles.startboldText}>
                🕹️ Game Rules & Scoring System{" "}
              </Text>
              <Text style={styles.startText}>
                5 Questions, multiple choices (10 points each). {"\n"}
                2-minute timer: Finish early and get a bonus! (Your remaining
                time divided by 2 is added to your score). Final Score: Correct
                answers (up to 50 points) {"\n"}
                Time bonus (based on how quickly you finish).
              </Text>
              <Text style={styles.startboldText}>
                🏆 Pro Tip for High Scores
              </Text>
              <Text style={styles.startText}>
                Answer fast and accurately to boost your score! Ready? Let’s go!
                🚀
              </Text>

              <GeoButton
                name="Start"
                onPress={() => startQuiz()}
                style={styles.learnButton}
              />
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  startboldText: {
    fontFamily: "Roboto_700Bold",
    marginBottom: 5,
    fontSize: 18,
  },
  startText: {
    fontFamily: "Roboto_500Medium",
    marginBottom: 5,
  },
  startModal: {
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  timerText: {
    alignSelf: "center",
  },
  timerStyle: {
    fontSize: 35,
    color: "#008000",
  },
  timerContainer: {
    backgroundColor: "#ffffff",
    width: "28%",
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#008000",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: 'sticky',
    top: 1,
    zIndex: 1,
  },
  backIcon: {
    fontSize: 25,
    color: "#ffffff",
  },
  backButtonContainer: {
    position: "absolute",
    top: 13,
    left: 13,
    zIndex: 1,
  },
  questionNumber: {
    color: "#008000",
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#ffffff",
  },
  learnButton: {
    backgroundColor: "#008000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    height: 40,
    width: 160,
    alignSelf: "center",
  },
  modalContainer: {
    alignSelf: "center",
    // width: 300,
    // height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  container: {
    padding: 16,
    backgroundColor: "#008000",
    paddingTop: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingImage: {
    width: 400,
    height: 400,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
    color: "#ffffff",
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
    color: "#333",
    fontFamily: "Roboto_500Medium",
  },
  choicesContainer: {
    marginTop: 10,
  },
  choiceButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 12,
  },
  selectedCorrectChoice: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#d3d3d3",
    borderColor: "#000000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 12,
  },
  selectedWrongChoice: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#d3d3d3",
    borderColor: "#000000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 12,
  },
  choiceText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Roboto_300Light",
  },
  submitButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: "#008000",
    fontWeight: "bold",
  },
});
