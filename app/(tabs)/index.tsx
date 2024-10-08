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
      "name": "Plate Boundaries"
    },
    {
      "id": "2",
      "name": "Internal Structures of the Earth"
    },
    {
      "id": "3",
      "name": "Processes and Landforms"
    }
  ];

  return (
      <View style={styles.mainContainer}>
          <View style={styles.topicContainer}>
             <Text style={styles.headerText}>Plate Tectonic Topics</Text>
          </View>
          {
            topics.map((topic) => {
              return (
                <GeoButton name = {topic.name} style={styles.plateTectonicButton} textStyle={styles.textColor} onPress={() => openTopic(topic.id)}></GeoButton>
              )
            })
          }
      </View>

      
      
  )
};

const styles = StyleSheet.create({

  plateTectonicButton:{
      backgroundColor: '#008000',
      borderRadius: 10,
      width: '90%',
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0.2, height: 10},
      shadowOpacity: 0.5,
      shadowRadius: 10,
      marginTop: 20,
      // borderStyle: 'solid',
      // borderWidth: 1
  },
  mainContainer: {
      flex: 1,
      alignItems:'center',
      display: 'flex',
      backgroundColor: 'white',
      flexDirection: 'column',
  },
  // plateContainer:{
  //   width: '100%',
  //   height: 100,
  //   //borderRadius: 10,
  //   backgroundColor: '#84b522',
  //   //marginTop: 90,
  //   marginBottom: 10,
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderStyle: 'solid',
  //   borderWidth: 1,
  //   // shadowColor: '#000',
  //   // shadowOffset: { width: 0.2, height: 10}
  // },
  textColor:{
      color: '#ffffff',
      fontWeight: 'normal',
      fontSize: 30,
      textAlign: 'center',
      fontFamily: 'sans-serif'
  },
  headerText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 33,
      fontFamily: 'sans-serif',
      // textAlign: 'center',
      // textShadowColor: '#000',
      // textShadowOffset: {width: 0, height: 3}
  },
  topicContainer: {
      marginTop: 40,
      alignSelf: 'baseline',
      marginLeft: '6%'
  }
  
})