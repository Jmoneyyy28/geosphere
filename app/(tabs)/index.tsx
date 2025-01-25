import { Image, StyleSheet, View, Text } from "react-native";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { useRouter, useLocalSearchParams } from "expo-router";
import { GeoButton } from "@/components/GeoButton";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function LearnScreen() {
  const params = useLocalSearchParams();
  const ENDPOINTS = {
    topics: "topics",
  };
  const router = useRouter();

  // State for topics and loading
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopics();
  }, []);

  // Fetch topics from API
  const getTopics = () => {
    setLoading(true); // Start loading before fetching
    axios({
      method: "GET",
      url: ENDPOINTS.topics,
    })
      .then((res) => {
        setTopics(res.data);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetching is complete
      });
  };

  const openLesson = (topic_id) => {
    router.replace({ pathname: "/lesson", params: { topic_id: topic_id } });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topicContainer}>
        <Text style={styles.headerText}>PLATE TECTONIC TOPICS</Text>
      </View>

      {loading ? ( // Show loading GIF while loading
        <View style={styles.loadingPosition}>
          <Image
            style={{ height: 400, width: 400 }}
            source={require("@/assets/images/loading.gif")}
          />
        </View>
      ) : (
        topics.map((topic) => (
          <GeoButton
            style={styles.plateTectonicButton}
            textStyle={styles.textColor}
            onPress={() => openLesson(topic.id)}
            key={topic.id}
          >
            <View style={styles.test}>
              <View style={styles.textContentContainer}>
                <Text style={styles.topicText}>{topic.topic_name}</Text>
                <Text style={styles.bodyText}>{topic.topic_description}</Text>
              </View>
            </View>
          </GeoButton>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingPosition: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContentContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "baseline",
    maxWidth: "95%",
    position: "absolute",
    marginTop: 10,
  },
  topicText: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Roboto_500Medium",
  },
  bodyText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Roboto_300Light",
    marginTop: 5,
  },
  test: {
    flex: 1,
    width: "90%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
  mainContainer: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    backgroundColor: "white",
    flexDirection: "column",
    paddingTop: 10
  },
  textColor: {
    color: "#ffffff",
    fontWeight: "normal",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  headerText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 28,
    fontFamily: "Roboto_900Black",
  },
  topicContainer: {
    marginTop: 40,
    alignSelf: "baseline",
    marginLeft: "6%",
  },
});
