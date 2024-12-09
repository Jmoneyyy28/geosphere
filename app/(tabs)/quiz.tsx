import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import axios from "axios";
import { GeoButton } from "@/components/GeoButton";
import { StorageService } from "@/services/StorageService";
import Modal from "react-native-modal";
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";



axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINTS = {
  quiz: "topics/quiz",
  questions: "topics/question",
  score: "topics/quiz",
  progress: "topics/progress"

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
  
  const router = useRouter();

  useEffect(() => {
    
    setLoading(true);
    getQuiz();
    getProfile();
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
        topic_id: topic_id
      },
    }).then((res) =>
      console.log("Progress Success")
    );
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
    setScore(tempScore);
    postScore(profile.id, quiz.id, tempScore);

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
    }).then((showModalSuccess));
  };

  const showModalSuccess = () => {
    postProgress(profile.id, "quiz", params.topic_id);
    setIsModalVisible(() => !isModalVisible);
  }

  const handleSelectAnswer = (questionId, choice) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const isCorrectChoice = (question, choice) => question.answer === choice;

  const learnMore = () => {
    setIsModalVisible(false);
    router.replace("/leaderboard");
}
  const backToHome = () => {
    setIsModalVisible(false);
    router.replace("/");
  }
  const backQuiz = () => {
    router.replace("/");
  };

  const totalScore = 10 * questions.length;

return (
  <ScrollView style={styles.container}>
    {quiz === null ? (
      <View style={styles.loadingContainer}>
        <Image source={require('@/assets/images/loading.gif')} style={styles.loadingImage} />
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <Image source={require('@/assets/images/loading.gif')} style={styles.loadingImage} />
          </View>
        ) : (
          <View style={styles.questionsContainer}>
            {questions.map((question, index) => (
              <View key={question.id} style={styles.questionContainer}>
                <Text style={styles.questionNumber}>Question: {index +1}/{questions.length}</Text>
                <Text style={styles.questionText}>{question.question}</Text>
                <View style={styles.choicesContainer}>
                  {["choice_a", "choice_b", "choice_c", "choice_d"].map((choiceKey) => {
                    const choice = question[choiceKey];
                    const isSelected = selectedAnswers[question.id] === choice;
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
                        onPress={() => handleSelectAnswer(question.id, choice)}
                      >
                        <Text style={styles.choiceText}>{choice}</Text>
                      </GeoButton>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}
        {!loading && (
          <View style = {{paddingBottom: 25}}>
          <GeoButton style={styles.submitButton} onPress={() => submit()}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </GeoButton>
          </View>
        )}
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContainer}>
            <Text style ={styles.questionText}>Score for this quiz: {score} out of {totalScore}</Text>
            <GeoButton 
            name="See Leaderboard" 
            onPress={learnMore} 
            style={styles.learnButton}/>
             <GeoButton 
            name="Back to Home" 
            onPress={backToHome} 
            style={styles.learnButton}/>
          </View>
        </Modal>
      </>
    )}
  </ScrollView>
);

}

const styles = StyleSheet.create({
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
    marginBottom: 20
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
    alignSelf: 'center'

  },
  modalContainer: {
        alignSelf: 'center',
        width: 300,
        height: 200,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
  },
  container: {
    padding: 16,
    backgroundColor: "#008000",
    paddingTop: 25
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
    marginTop: 20
  },
  submitButtonText: {
    fontSize: 18,
    color: "#008000",
    fontWeight: "bold"
  },
});