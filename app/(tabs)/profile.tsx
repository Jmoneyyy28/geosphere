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
import { Ionicons } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';


export default function ProfileScreen() {
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

    return (
        <View style={styles.mainContainer}>
            <GeoButton style={styles.signOutButton} onPress={signOut}>
                <Ionicons name="log-out-outline" style={styles.icon}/>
            </GeoButton>
            <View style={styles.profile}>
                <View style={styles.profilePicture}></View>
                <Text style={styles.name}>Welcome, {profile.name}!</Text>
            </View>
            <View style={styles.dashboardContainer}>
                <TouchableHighlight 
                activeOpacity={0.6}
                underlayColor="white"
                onPress={ () => plateTectonicScreen()}
                style={styles.platetectonicButton}>
                    <Text style={styles.textColor}>Plate Tectonic Topics</Text>
                </TouchableHighlight>

                {/* Horizontal container for Leaderboard and Badge buttons */}
                <View style={styles.horizontalContainer}>
                    <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="yellow"
                    onPress={ () => leaderboardScreen()}
                    style={styles.leaderboardButton}>
                        <Text style={styles.textColor}>No. {profile.leaderboard_rank} Leaderboard</Text>
                    </TouchableHighlight>


                    <View style={styles.badgeContainer}>
                        <View style={styles.badges}>
                            {
                                (
                                    profile.badges.earth_structures
                                        ? <Image style={styles.badge} source={badges.earth_structures}/>
                                        : <Image style={styles.badge} source={badges.locked}/>
                                )
                            }
                            {
                                (
                                    profile.badges.plate_boundaries
                                    ? <Image style={styles.badge} source={badges.plate_boundaries}/>
                                    : <Image style={styles.badge} source={badges.locked}/>
                                )
                            }
                            {
                                profile.badges.landform_process
                                ? <Image style={styles.badge} source={badges.landform_process}/>
                                : <Image style={styles.badge} source={badges.locked}/>
                            }
                            
                        </View>
                            <Text style={styles.textColor}>Badges</Text>
                    </View>
                    <View>

                    </View>
                </View>
              
                {
                    feedback.map((feedback) => {
                        return (
                             <GeoButton name="Feedbacks" theme="light" textStyle={styles.textColor} style={styles.feedbackButton} onPress={() => openFeedback(feedback.id)}/>
                        )
                    })
                }
            </View>
        </View>
    );
}
const badges = {
    locked:  "https://i.imgur.com/wFCKPUT.png",
    earth_structures: "https://i.imgur.com/50D8GOH.png",
    plate_boundaries: "https://i.imgur.com/g2Lj9XF.png",
    landform_process: "https://i.imgur.com/YABdVql.png"

}

const profile = {
    "name": "Mastrile_3210472",
    "leaderboard_rank": 3,
    "badges": {
        "earth_structures": true,
        "plate_boundaries": false,
        "landform_process": true
    }
}

const styles = StyleSheet.create({
    testing: {
        backgroundColor: 'black',
        height: 20
    },
    profile: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 15,
        left: 15
    },
    signOutButton: {
        height: 50,
        width: 50,
        position: 'absolute',
        top: 15,
        right: 15
    },
    icon: {
        color: 'white',
        fontSize: 35
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 60,
        marginRight: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center'
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#008000',
        alignItems: 'center',
        verticalAlign: 'top'
    },
    dashboardContainer: {
        height: 1600,
        width: 1300,
        borderRadius: 3600,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // borderStyle: 'solid',
        // borderWidth: 1,
        zIndex: 1000,
        marginTop: 130
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
    badgeContainer: {
        width: 200, // Adjusted width for side-by-side layout
        height: 120,
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        // borderStyle: 'solid',
        // borderWidth: 1,
         borderRadius: 20,
        alignItems: 'center',
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
    },
    badge: {
        width: 65,
        height: 85
    },
    name: {
        color: 'white',
        fontWeight: 'condensed',
        fontSize: 15,
        textAlign: 'center'
    }
    
});