import { Image, StyleSheet, View, Text } from "react-native";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "expo-router";
import { GeoButton } from "@/components/GeoButton";

export default function LearnScreen() {
  const BASE_URL = "http://localhost:3000/";
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
    axios
      .get(`${BASE_URL}${ENDPOINTS.topics}`)
      .then((res) => {
        console.log(res.data);
        setTopics(res.data);
        // setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
      });
  };

  const openTopic = (id) => {
    router.push(`/topic/${id}`);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topicContainer}>
        <Text style={styles.headerText}>PLATE TECTONIC TOPICS</Text>
      </View>

      {!loading ? (
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
            onPress={() => openTopic(topic.id)}
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
