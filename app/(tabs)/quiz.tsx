import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
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
      params: {
        topic_id: params.topic_id,
      },
    }).then((res) => {
      console.log(res.data);
      setQuiz(res.data[0]);
    });
  };

  const getQuestions = () => {
    console.log(quiz);
    axios({
      url: ENDPOINTS.questions,
      method: "get",
      params: {
        quiz_id: quiz.id,
      },
    }).then((res) => {
      console.log(res.data);
      setQuestions(res.data);
    });
  };

  return (
    <ScrollView>
      {quiz === null ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>{quiz.quiz_title}</Text>
          <View>
            {questions.map((question) => (
              <View key={question.id}>
                <Text>{question.question}</Text>
                <View>
                  <GeoButton name={question.choice_a} />
                  <GeoButton name={question.choice_b} />
                  <GeoButton name={question.choice_c} />
                  <GeoButton name={question.choice_d} />
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}
