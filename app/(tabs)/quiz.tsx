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
} from "@react-navigation/native";
import { colors } from "react-native-keyboard-controller/lib/typescript/components/KeyboardToolbar/colors";

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isStartModalVisible, setIsStartModalVisible] = React.useState(false);
  const [isScoreModalVisible, setIsScoreModalVisible] = React.useState(false);
  const [remainingTime, setRemainingTime] = useState(quizTime);
  const [questionScore, setquestionScore] = useState(0);
  const [finalRemainingTime, setFinalRemainingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isHintModalVisible, setIsHintModalVisible] = useState(false);


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
      setQuiz(res.data[0]);
    });
  };

  const getQuestions = () => {
    setLoading(true);
    axios({
      url: ENDPOINTS.questions,
      method: "get",
      params: { quiz_id: quiz.id },
    })
      .then((res) => {
        setQuestions(res.data);
      })
      .finally(() => {
        setLoading(false);
        setIsStartModalVisible(true);
      });
  };

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const formatTimer = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
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

  const handleSelectAnswer = (questionId, choice) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

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
    postScore(profile.id,quiz.id, totalScore);
    setquestionScore(tempScore);
    setScore(totalScore);
    setIsScoreModalVisible(true);
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

const showModalHint = () => {
  setIsHintModalVisible(true);
};
  const startQuiz = () => {
    setIsStartModalVisible(false);
    setIsTimerRunning(true);
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
            <GeoButton onPress={() => router.back()} theme="transparent">
              <Ionicons name="arrow-back" style={styles.backIcon} />
            </GeoButton>
          </View>
          <Text style={styles.quizTitle}>{quiz.quiz_title}</Text>
          <Text style={styles.questionTitle}>{questions.length} Questions</Text>
          <View style={styles.timerContainer}>
            <Ionicons name="timer-outline" style={styles.timerStyle} />
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
              {questions.length > 0 && (
                <View style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>
                    Question: {currentQuestionIndex + 1}/{questions.length}
                  </Text>
                  <Text style={styles.questionText}>
                    {questions[currentQuestionIndex].question}
                  </Text>
                  <View style={styles.choicesContainer}>
                    {["choice_a", "choice_b", "choice_c", "choice_d"].map(
                      (choiceKey) => {
                        const choice =
                          questions[currentQuestionIndex][choiceKey];
                        const isSelected =
                          selectedAnswers[
                            questions[currentQuestionIndex].id
                          ] === choice;

                        return (
                          <GeoButton
                            key={choiceKey}
                            style={
                              isSelected
                                ? styles.selectedCorrectChoice
                                : styles.choiceButton
                            }
                            onPress={() =>
                              handleSelectAnswer(
                                questions[currentQuestionIndex].id,
                                choice
                              )
                            }
                          >
                            <Text style={styles.choiceText}>{choice}</Text>
                          </GeoButton>
                        );
                      }
                    )}
                  </View>
                </View>
              )}
              <View style={styles.navigationContainer}>
              <GeoButton 
                style={styles.hintButton}
                onPress={showModalHint}>
                  <Text style={styles.hintText}>Hint</Text>
                </GeoButton>
                <GeoButton
                  style={[
                    styles.prevButton,
                    currentQuestionIndex === 0 && styles.disabled,
                  ]}
                  onPress={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <Text style={styles.navigationText}>Previous</Text>
                </GeoButton>
                <GeoButton
                  style={[
                    styles.nextButton,
                    currentQuestionIndex === questions.length - 1 &&
                      styles.disabled,
                  ]}
                  onPress={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  <Text style={styles.navigationText}>Next</Text>
                </GeoButton>
              </View>
              {currentQuestionIndex === questions.length - 1 && (
                <GeoButton
                  style={styles.submitButton}
                  onPress={() => submit()}
                >
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                </GeoButton>
              )}
            </View>
          )}
          {/* Start Modal */}
          <Modal isVisible={isHintModalVisible}
            style={{justifyContent: 'flex-end', marginBottom: 90}}
            animationIn={'tada'}
            onBackdropPress={() => setIsHintModalVisible(false)}
            backdropOpacity={0}
          >
            <View style={styles.labelModalContainer}>
              <Text style={styles.startboldText}>Hint</Text>
              {questions[currentQuestionIndex] ? ( // Ensure the question exists before accessing properties
                <Text style={styles.startText}>{questions[currentQuestionIndex].hint || "No hint available"}</Text>
              ) : (
                <Text style={styles.startText}>Loading hint...</Text>
              )}
            </View>
          </Modal>
          <Modal isVisible={isStartModalVisible}>
            <View style={styles.modalContainer}>
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
                style={styles.learnButton}
                onPress={() => startQuiz()}
              >
                <Text style={styles.startQuizText}>Start Quiz</Text>
              </GeoButton>
            </View>
          </Modal>

          {/* Score Modal */}
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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  labelModalContainer: {
    alignSelf: "center",
    width: '80%',
    height: '15%',
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15
  },
  hintText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: "#008000"
  },
  navigationText: {
      fontFamily: 'Roboto_500Medium',
      fontSize: 15
  },
  navigationContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hintButton: {
    backgroundColor: "#ffffff",
    width: "20%",
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    height: 35
  },
  prevButton: {
    backgroundColor: "#ffffff",
    width: "28%",
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    height: 35,
    marginLeft: 50
  },
  nextButton: {
    backgroundColor: "#ffffff",
    width: "28%",
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    height: 35,
  },
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
    zIndex: 1
  },
  backIcon: {
    fontSize: 25,
    color: "#ffffff",
  },
  backButtonContainer: {
    position: "absolute",
    top: '2%',
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
    color: "#000000",
    fontWeight: "bold",
  },
  startQuizText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold"
  }
});