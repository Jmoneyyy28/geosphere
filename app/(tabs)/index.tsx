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
  TouchableHighlight
} from 'react-native';

import React from 'react';

import { useRouter } from 'expo-router';
import { GeoButton } from '@/components/GeoButton';

export default function LearnScreen() {
  const router = useRouter();

  const openTopic = (id) => {
    console.log(id);
    router.push(`/topic/${id}`);
  };

  const topics = [
    {
      "id": "1",
      "name": "Plate Boundaries",
      "description": "Learn about the three types of plate boundaries: divergent, convergent, and transform."
    },
    {
      "id": "2",
      "name": "Internal Structures of the Earth",
      "description": "Explore the Earth's core, mantle, and crust."
    },
    {
      "id": "3",
      "name": "Processes and Landforms",
      "description": "Understand various geological processes and the landforms they create."
    }
  ];

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topicContainer}>
        <Text style={styles.headerText}>PLATE TECTONIC TOPICS</Text>
      </View>
      {
        topics.map((topic) => {
          return (
            <GeoButton style={styles.plateTectonicButton} textStyle={styles.textColor} onPress={() => openTopic(topic.id)} key={topic.id}>
              <View style={styles.test}>
                <View style={styles.textContentContainer}>
                  <Text style={styles.topicText}>{topic.name}</Text>
                  <Text style={styles.bodyText}>{topic.description}</Text>
                </View>
              </View>
            </GeoButton>
          )
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  textContentContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    //marginLeft: 1, // Space between the image and text
    maxWidth: '95%', 
    zIndex: 2, // text layer
    position: 'absolute',
    marginTop: 10
  },
  topicText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Roboto_500Medium',
    zIndex: 2, // topic layer
  },
  bodyText: {
    color: '#ffffff',
    fontSize: 15, 
    fontFamily: 'Roboto_300Light',
    zIndex: 2, // layer
    marginTop: 5, // space of text and topic
  },
  test: {
    flex: 1,
    width: '90%',
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start'
    //paddingHorizontal: 10, // Add padding on the sides
  },
  plateTectonicButton: {
    backgroundColor: '#008000',
    borderRadius: 5,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0.2, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginTop: 20,
    
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  textColor: {
    color: '#ffffff',
    fontWeight: 'normal',
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'sans-serif'
  },
  headerText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 28,
    fontFamily: 'Roboto_900Black',
  },
  topicContainer: {
    marginTop: 40,
    alignSelf: 'baseline',
    marginLeft: '6%'
  }
});
