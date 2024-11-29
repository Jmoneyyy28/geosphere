import {
  Image,
  StyleSheet,
  TextInput,
  Modal,
  View,
  Pressable,
  Text,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { useEffect, useState, useCallback } from "react";
import { GeoButton } from "@/components/GeoButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import axios from "axios";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

const AUDIO = {
    "topic1Voice": require("@/assets/sounds/plateBoundariesVoice.mp3"),
    "topic2Voice": require("@/assets/sounds/InternalStructureVoice.mp3"),
    "topic3Voice": require("@/assets/sounds/processesAndLandformVoice.mp3")
}

export default function TopicScreen() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const ENDPOINTS = {
    topics: "topics",
    badges: "badges",
    feedback: "feedback",
    lesson: "topics/lesson",
  };

  useEffect(() => {
    setLoading(true);
    getLesson();
    setSound(null);
  }, [params.topic_id]);


  const getLesson = () => {
    axios({
      url: ENDPOINTS.lesson,
      method: "get",
      params: { topic_id: params.topic_id },
    }).then((res) => {
      setLesson(res.data[0]);
      console.log(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(AUDIO[lesson.voice]);
    setSound(sound);
    await sound.playAsync();
    setIsPlaying(true);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const toggleSound = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      playSound();
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopSound(); // Ensure sound is stopped when leaving the page
      };
    }, [])
  );

  const backLesson = () => {
    router.replace("/profile");
  };

  const goToQuiz = () => {
    router.replace({ pathname: "/quiz", params: { lesson_id: lesson.id } });
  };

  const goToAr = () => {
    router.replace({ pathname: "/ar"});
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingPosition}>
            <Image
              style={{ height: 400, width: 400 }}
              source={require("@/assets/images/loading.gif")}
            />
          </View>
        ) : (
          <>
            <View style={styles.backButtonContainer}>
              <GeoButton onPress={backLesson} theme="transparent">
                <Ionicons name="arrow-back" style={styles.backIcon} />
              </GeoButton>
            </View>
            <Image
              source={{ uri: lesson.lesson_picture }}
              style={styles.image}
            />
            <View style={styles.optionContainer}>
              <GeoButton onPress={goToQuiz} theme="transparent">
                <Ionicons name="book" style={styles.optionIcon} />
              </GeoButton>
              <GeoButton onPress={goToAr} theme="transparent">
                <Ionicons name="cube" style={styles.optionIcon} />
              </GeoButton>
              <GeoButton onPress={toggleSound} theme="transparent">
                <Ionicons
                  name={
                    isPlaying ? "volume-high-outline" : "volume-mute-outline"
                  }
                  style={styles.optionIcon}
                />
              </GeoButton>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.topicText}>{lesson.lesson_title}</Text>
              <ScrollView style={styles.scrollView}>
                <Text style={styles.lessonText}>{lesson.lesson}</Text>
              </ScrollView>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingPosition: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#008000",
    alignItems: "center",
    paddingTop: 40,
  },
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 25,
    zIndex: 1,
  },
  backIcon: {
    fontSize: 28,
    color: "#ffffff",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  optionContainer: {
    position: "absolute",
    top: 350,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  optionIcon: {
    fontSize: 28,
    color: "#008000",
    marginHorizontal: 8,
  },
  descriptionContainer: {
    marginTop: 120,
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  topicText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
    marginTop: 5,
  },
  lessonText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    textAlign: "justify",
  },
});
