import {
    Image,
    StyleSheet,
    TextInput,
    Modal,
    View,
    Pressable,
    Text,
    ImageBackground,
    TouchableOpacity
} from 'react-native';

import React from 'react';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();

    const signOut = () => {
        router.replace("/login");
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.profilePicture}></View>
            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.dashboardContainer}>
                <Pressable style={styles.platetectonicButton}>
                    <Text style={styles.textColor}>Plate Tectonic Topics</Text>
                </Pressable>

                {/* Horizontal container for Leaderboard and Badge buttons */}
                <View style={styles.horizontalContainer}>
                    <Pressable style={styles.leaderboardButton}>
                        <Text style={styles.textColor}>No. {profile.leaderboard_rank} Leaderboard</Text>
                    </Pressable>

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
                </View>
                <Pressable style={styles.feedbackButton}>
                <Text style={styles.textColor}>Feedbacks</Text>
            </Pressable>
            </View>
            <Pressable onPress={() => signOut()} style={styles.signoutButton}>
                <Text style={styles.signoutText}>Sign Out</Text>
            </Pressable>
        </View>
    );
}
const badges = {
    locked: "https://i.imgur.com/cgmbSaF.png",
    earth_structures: "https://i.imgur.com/AYxZLVf.png",
    plate_boundaries: "https://i.imgur.com/N3keyxj.png",
    landform_process: "https://i.imgur.com/MjTQiO8.png"

}

const profile = {
    "name": "Mastrile_3210472",
    "leaderboard_rank": 3,
    "badges": {
        "earth_structures": true,
        "plate_boundaries": true,
        "landform_process": false
    }
}

const styles = StyleSheet.create({
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 80
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#228b22',
        alignItems: 'center',
        verticalAlign: 'top'
    },
    dashboardContainer: {
        width: 400,
        height: 400,
        borderRadius: 10,
        backgroundColor: '#84b522',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    platetectonicButton: {
        backgroundColor: '#84b522',
        borderRadius: 50,
        width: 350,
        height: 100,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginTop: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        //marginLeft: 5,
    },
    feedbackButton: {
        backgroundColor: '#84b522',
        borderRadius: 50,
        width: 350,
        height: 100,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginTop: 15,
        borderStyle: 'solid',
        borderWidth: 1,
    },
    textColor: {
        color: '#ffffff',
        fontWeight: 'bold',
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
        borderStyle: 'solid',
        borderWidth: 1,
    },
    badgeContainer: {
        width: 200, // Adjusted width for side-by-side layout
        height: 120,
        justifyContent: 'center',
        backgroundColor: 'green',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    badges: {
        display: 'flex',
        flexDirection: 'row'
    },
    signoutButton: {
        backgroundColor: 'white',
        borderRadius: 50,
        width: 250,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        marginTop: 50,
        
    },
    signoutText: {
        color: 'red',
        fontSize: 15,
        textAlign: 'center',
    },
    badge: {
        width: 68,
        height: 68
    },
    name: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20
    }
    
});
