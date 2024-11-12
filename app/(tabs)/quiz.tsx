import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import axios from "axios";
import { GeoButton } from "@/components/GeoButton";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINTS = {
  quiz: "topics/quiz",
  questions: "topics/question",
};

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    getQuiz();
  }, []);

  useEffect(() => {
    if (quiz) {
      getQuestions();
    }
  }, [quiz]);

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
    axios({
      url: ENDPOINTS.questions,
      method: "get",
      params: { quiz_id: params.quiz_id },
    }).then((res) => {
      setQuestions(res.data);
    });
  };

  const handleSelectAnswer = (questionId, choice) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleSubmit = () => {
    console.log("Selected answers:", selectedAnswers);
    // Add submission logic here
  };

  return (
    <ScrollView style={styles.container}>
      {quiz === null ? (
        <View style={styles.loadingContainer}>
          <Image source={require('@/assets/images/loading.gif')} style={styles.loadingImage} />
        </View>
      ) : (
        <>
          <Text style={styles.quizTitle}>{quiz.quiz_title}</Text>
          <View style={styles.questionsContainer}>
            {questions.map((question) => (
              <View key={question.id} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>
                <View style={styles.choicesContainer}>
                  {["choice_a", "choice_b", "choice_c", "choice_d"].map((choiceKey) => (
                    <GeoButton
                      key={choiceKey}
                      style={[
                        styles.choiceButton,
                        selectedAnswers[question.id] === question[choiceKey] && styles.selectedChoice,
                      ]}
                      onPress={() => handleSelectAnswer(question.id, question[choiceKey])}
                    >
                      <Text style={styles.choiceText}>{question[choiceKey]}</Text>
                    </GeoButton>
                  ))}
                </View>
              </View>
            ))}
          </View>
          <GeoButton style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Answers</Text>
          </GeoButton>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#008000",
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
    marginBottom: 20,
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
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedChoice: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  choiceText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Roboto_300Light",
  },
  submitButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: "#008000",
    fontWeight: "bold",
  },
});