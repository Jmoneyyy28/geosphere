import {
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView
} from 'react-native';

import React, { useState, useEffect} from 'react';
import { useRouter } from 'expo-router';
import { GeoButton } from '@/components/GeoButton';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';


export default function ProfileScreen() {

  const BASE_URL = "https://dev-p9dsmajcnao35cj.api.raw-labs.com/api/";
  const ENDPOINTS = {
    topics: "topics" 
  };

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    getTopics();
  }, []);

  const getTopics = () => {
    axios.get(`${BASE_URL}${ENDPOINTS.topics}`)
      .then(res => {
        setTopics(res.data);
      })
      .catch(error => {
        console.error("Error fetching topics:", error);
      });
  };

  const openTopic = (id) => {
    console.log(id);
    router.push(`/topic/${id}`);
  };

  const BASE_URL = "https://dev-p9dsmajcnao35cj.api.raw-labs.com/api/";
  const ENDPOINTS = {
    badges: "badges" 
  };

  const [badges, setBadges] = useState([]);

  useEffect(() => {
    getBadges();
  }, []);

  const getBadges = () => {
    axios.get(`${BASE_URL}${ENDPOINTS.topics}`)
      .then(res => {
        setBadges(res.data);
      })
      .catch(error => {
        console.error("Error fetching topics:", error);
      });
  };

  const openBadges = (id) => {
    console.log(id);
    router.push(`/badge/${id}`);
  };

    const [segmentButtons, setSegmentButtons] = useState([
        {
            name: "Lessons",
            isActive: true
        },
        {
            name: "Badges",
            isActive: false
        },
        {
            name: "Feedback",
            isActive: false
        }
    ]);

    const getBadge = (badge) => {
        if (badge.score > 75){
            return badge.images.gold
        } else if (badge.score > 50){
            return badge.images.silver
        } else {
            return badge.images.bronze
        }
    }

    const router = useRouter();

    const signOut = () => {
        router.replace("/login");
    }

    const plateTectonicScreen = () => {
        router.replace("/");
    }

    const leaderboardScreen = () => {
        router.replace("/leaderboard");
    }

    const openFeedback = (id) => {
        console.log(id);
        router.push(`/feedback/${id}`);
    };

    const feedbacks = [
        {
            "id": 1,
            "name": "Plate boundaries",
            "Teacher": "Sir. 1",
            "feedback": "You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! You did well! "
        },
        {
            "id": 2,
            "name": "Internal Structures of the Earth",
            "Teacher": "Sir. 2",
            "feedback": "Bad!"
        },
        {
            "id": 3,
            "name": "Processes and Landforms",
            "Teacher": "Sir. 3",
            "feedback": "Excellent"
        },
        {
            "id": 4,
            "name": "Internal Structures of the Earth",
            "Teacher": "Sir. 4",
            "feedback": "Bad!"
        },
        
    ];
    
    const updateView = (name) => {
        const updatedButtons = [];

        segmentButtons.map((button) => {
            const temp = {...button};
            temp.isActive = temp.name == name;

            updatedButtons.push(temp);
        });

        setSegmentButtons(updatedButtons);
    }
    

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <View style={styles.profileContainer}>
                    <Image
                        style={styles.profilePicture}
                        source={require('@/assets/images/profile-male.png')} />

                    <Text style={styles.name}>
                        Welcome, {profile.name}!
                    </Text>
                </View>

                <View style={{flex: 1}}/>

                <View style={styles.headerButtons}>
                    <GeoButton 
                        onPress={signOut}
                        theme='transparent'>

                        <Ionicons
                            name="log-out-outline"
                            style={styles.signOutIcon}
                        />
                    </GeoButton>
                </View>

            </View>

            <View style={styles.content}>

                <View style={styles.segmentButtons}>
                    {
                        segmentButtons.map((button) => {
                            return (
                                <GeoButton style={styles.segmentButton} theme="transparent" name={button.name} isActive={button.isActive} onPress={() => updateView(button.name)}/>
                            )
                        })
                    }
                </View>
                
                {
                    segmentButtons.map((segment) => {
                        if (segment.name == "Lessons" && segment.isActive) {
                            return (
                                <View style={styles.segmentContainer}>
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
                            )
                        } else if (segment.name == "Badges" && segment.isActive) {
                            return (
                                <ScrollView>
                                    <View style={styles.segmentContainer}>
                                        {
                                            profile.badges.map((badge) => {
                                                return (
                                                    <View style={styles.badgeContainer}>
                                                        <Image
                                                            style={styles.badgeImage}
                                                            source={badge.isAcquired ? getBadge(badge) : locked_badge}
                                                        />
                                                        <Text style={styles.badgeName}>
                                                            { badge.name }
                                                        </Text>
                                                        <Text style={styles.badgeDescription}>
                                                            { badge.description }
                                                        </Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>
                            )
                        } else if (segment.name == "Feedback" && segment.isActive) {
                            return (
                                <ScrollView>
                                    <View style={styles.segmentContainer}>
                                        {
                                            feedbacks.map((feedback) => {
                                                return (
                                                    
                                                        
                                                            <View style={styles.descriptionContainer}>
                                                                <View style={styles.teacherName}>
                                                                    <Image style={styles.feedbackStyle}
                                                                        source={require('@/assets/images/profile-male.png')} />
                                                                            <Text style={styles.teacherName}>
                                                                                {feedback.Teacher}
                                                                            </Text>
                                                                </View>
                                                                                <View style={styles.contentText}>
                                                                                    <Text style={styles.topicText2}>{feedback.name}</Text>
                                                                                    <Text style={styles.lessonText}>{feedback.feedback}</Text>
                                                                                </View>
                                                                    
                                                            </View>
                                                        
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>
                        )
                    }
                })
            }

            </View>

        </View>
    );
}

const locked_badge = "https://i.imgur.com/ZJS5FQJ.png";

const profile = {
    "name": "Mastrile_3210472",
    "leaderboard_rank": 3,
    "badges": [
        {
            name: "Earth Structures",
            images: {
                bronze: "https://i.imgur.com/auHaCIs.png",
                silver: "https://i.imgur.com/nQMeKD9.png",
                gold: "https://i.imgur.com/Yszl4Jp.png"
            },
            description: "Badge acquired for completing the lesson Earth Structures",
            isAcquired: true,
            score: 100
        },
        {
            name: "Plate Boundaries",
            images: {
                bronze: "https://i.imgur.com/yzvNj2Q.png",
                silver: "https://i.imgur.com/a8FZ3zO.png",
                gold: "https://i.imgur.com/AOSXqWc.png"
            },
            description: "Badge acquired for completing the lesson Plate Boundaries",
            isAcquired: true,
            score: 60
        },
        {
            name: "Landform Process",
            images: {
                bronze: "https://i.imgur.com/ZUySv72.png",
                silver: "https://i.imgur.com/LCq81ws.png",
                gold: "https://i.imgur.com/IFYOtOp.png"
            },
            description: "Badge acquired for completing the lesson Landform Process",
            isAcquired: true,
            score: 50
        }
    ]
}

const styles = StyleSheet.create({
    bodyText: {
        color: '#ffffff',
        fontSize: 15, 
        fontFamily: 'Roboto_300Light',
        zIndex: 2, // layer
        marginTop: 5, // space of text and topic
      },
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

    test: {
        flex: 1,
        width: '90%',
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        justifyContent: 'flex-start'
        //paddingHorizontal: 10, // Add padding on the sides
      },
    topicText2:{
        fontFamily: 'Roboto_500Medium',
        //fontWeight: 'bold'
    },
    teacherName: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontFamily: 'Roboto_100Thin'
    },
    contentText: {
        marginTop: 10
    },
    descriptionContainer: {
        flexDirection: 'column',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginTop: 25,
        padding: 25,
        width: 350,
        shadowColor: '#212121',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.1,
        shadowRadius: 50,
        flexShrink: 1
    },
    feedbackStyle:{
        width: 35,
        height: 35,
        borderRadius: 35,
        marginRight: 15,
        backgroundColor: '#e0e0e0',
        //justifyContent: 'center',
        alignItems: 'baseline'
    },
    topicText: {
        color: '#ffffff',
        fontSize: 22,
        fontFamily: 'Roboto_500Medium',
        zIndex: 2, // topic layer
    },
    scrollView: {
        flex: 1, // Allow scrollable content to fill remaining space
    },
    lessonText: {
        fontSize: 14, // Slightly smaller size for body text
        textAlign: 'justify', // Justify the text
        marginTop: 5
    },
    plateTectonicButton:{
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
        marginTop: 20
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 65
    },
    headerButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        display: 'flex',
        flex: 1
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Roboto_100Thin'
    },
    signOutIcon: {
        color: '#9e9e9e',
        fontSize: 25
    },
    profilePicture: {
        width: 35,
        height: 35,
        borderRadius: 35,
        marginRight: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center'
    },
    segmentButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: "#EAEAEA",
        padding: 1,
        margin: 15,
        borderRadius: 5
    },
    segmentButton: {
        flex: 1,
        height: 25,
        borderRadius: 5
    },
    segmentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    badgeContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        padding: 25,
        height: 320,
        width: 250,
        shadowColor: '#212121',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.1,
        shadowRadius: 50,
    },
    badgeImage: {
        width: 200,
        height: 200
    },
    badgeName: {
        color: '#212121',
        fontSize: 24,
        fontFamily: 'Roboto_500Medium'
    },
    badgeDescription: {
        marginTop: 5,
        color: '#212121',
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'Roboto_300Light'
    },


    dashboardContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50
    },
    platetectonicButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        width: 350,
        height: 100,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginTop: 55,
        // borderStyle: 'solid',
        // borderWidth: 1,
        //marginLeft: 5,
    },
    feedbackButton: {
        width: 350,
        height: 55,
        marginTop: 15
        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    textColor: {
        color: 'white',
        //fontWeight: 'condensed',
        fontSize: 30,
        textAlign: 'center'
    },
    // New container for horizontal layout
    horizontalContainer: {
        flexDirection: 'row',
        marginTop: 20, // Spacing between the Plate Tectonic button and this container
        justifyContent: 'space-between',
        width: 350, // Match the width of Plate Tectonic Topics button
    },
    leaderboardButton: {
        backgroundColor: '#ffd700',
        borderRadius: 20,
        width: 130, // Adjusted width for side-by-side layout
        height: 120,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    badges: {
        display: 'flex',
        flexDirection: 'row'
    },
    signoutButton: {
        width: 250,
        height: 45,
        marginTop: 60
        
    },
    signoutText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    }
});