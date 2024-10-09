import {
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView
} from 'react-native';

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { GeoButton } from '@/components/GeoButton';
import { Ionicons } from '@expo/vector-icons';


export default function ProfileScreen() {
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
    const feedback = [
        {
            "id": "1",
            "name": "Plate boundaries"
        }
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
                                    Lessons
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
                                                            source={badge.isAcquired ? badge.image : locked_badge}
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
                                <View style={styles.segmentContainer}>
                                    Feedback
                                </View>
                            )
                        }
                    })
                }

            </View>

        </View>
    );
}

const locked_badge = "https://i.imgur.com/wFCKPUT.png";

const profile = {
    "name": "Mastrile_3210472",
    "leaderboard_rank": 3,
    "badges": [
        {
            name: "Earth Structures",
            image: "https://i.imgur.com/50D8GOH.png",
            description: "Badge acquired for completing the lesson Earth Structures",
            isAcquired: false
        },
        {
            name: "Plate Boundaries",
            image: "https://i.imgur.com/g2Lj9XF.png",
            description: "Badge acquired for completing the lesson Plate Boundaries",
            isAcquired: true
        },
        {
            name: "Landform Process",
            image: "https://i.imgur.com/YABdVql.png",
            description: "Badge acquired for completing the lesson Landform Process",
            isAcquired: false
        }
    ]
}

const styles = StyleSheet.create({
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
        fontSize: 10,
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
        color: '#008000',
        //fontWeight: 'condensed',
        fontSize: 20,
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