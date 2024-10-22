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
    ScrollView
} from 'react-native';

import {
    useNavigation,
    useLocalSearchParams
} from 'expo-router';

import { useEffect } from 'react';
import { GeoButton } from '@/components/GeoButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function TopicScreen() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();

    const topics = {
        "1": {
            "name": "Plate Boundaries",
            "lesson": "Plate boundaries are the areas where Earth's tectonic plates interact, leading to significant geological activity. There are three main types of plate boundaries. Divergent boundaries occur when plates move apart, allowing magma to rise and create new crust, as seen in the Mid-Atlantic Ridge. Convergent boundaries form when plates collide, often resulting in the formation of mountains or subduction zones, where one plate sinks beneath another, like the Himalayas. Transform boundaries happen when plates slide past each other horizontally, leading to earthquakes, such as along the San Andreas Fault. These boundaries play a crucial role in shaping Earth's surface.",
            "picture": "https://i.imgur.com/Jd0plRs.png"
        },
        "2": {
            "name": "Internal Structures of the Earth",
            "lesson": "The Earth’s internal structure consists of four main layers. The outermost layer, the crust, is thin and solid, forming both continental and oceanic plates. Beneath the crust is the mantle, a semi-solid layer of silicate rocks that extends deep into the Earth, with convection currents driving tectonic activity. Below the mantle is the outer core, made of liquid iron and nickel, which generates Earth's magnetic field. At the center is the inner core, a solid sphere of iron and nickel, kept solid despite high temperatures due to immense pressure.",
            "picture": "https://i.imgur.com/7N3AUWA.png"
        },
        "3": {
            "name": "Processes and Landforms",
            "lesson": "Earth's surface is shaped by various processes. Tectonic activity forms mountains, volcanoes, and causes earthquakes. Erosion and weathering break down rocks, creating valleys and canyons. Volcanic activity produces landforms like volcanoes and islands. River and glacial processes carve landscapes, forming features such as deltas, meanders, and glacial valleys. These processes continually reshape the Earth.",
            "picture": "https://i.imgur.com/V9RE09K.png"
        }
    }

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const getTopic = (id) => {
        return topics[id];
    }

    const topic = getTopic(id);
    
    const router = useRouter();

    const backTopic = () => {
        router.replace("/profile");
    }

    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                <GeoButton 
                    onPress={backTopic}
                    theme='transparent'>
                    <Ionicons
                        name="arrow-back"
                        style={styles.backIcon}
                    />
                </GeoButton>
            </View>
                <Image source={{ uri: topic.picture }} style={styles.image}/>
                    <View style={styles.optionContainer}>
                        <GeoButton 
                            onPress={backTopic}
                            theme='transparent'>
                                <Ionicons
                                    name="cube"
                                    style={styles.optionIcon}
                                />
                        </GeoButton>
                        <GeoButton 
                            onPress={backTopic}
                            theme='transparent'>
                                <Ionicons
                                    name="volume-high-outline"
                                    style={styles.optionIcon}
                                />
                        </GeoButton>

                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.topicText}>{topic.name}</Text>
                            <ScrollView style={styles.scrollView}>
                                <Text style={styles.lessonText}> {topic.lesson}</Text>
                            </ScrollView>
                    </View>
        </View>
    );
}

const styles = StyleSheet.create({
    optionIcon: {
        fontSize: 30,
        color: '#ffffff',
        margin: 5
    },
    optionContainer: {
        position: 'absolute',
        top: 310, // Adjust this value as needed to position vertically
        right: 30, // Adjust this value for horizontal position
        zIndex: 1, // Ensure it is on top of other elements
        display: 'flex',
        flexDirection: 'row'
    },
    backIcon: {
        fontSize: 28,
        color: '#ffffff'
    },
    backButtonContainer: {
        position: 'absolute',
        top: 20, // Adjust this value as needed to position vertically
        left: 25, // Adjust this value for horizontal position
        zIndex: 1, // Ensure it is on top of other elements
    },
    container: {
        flex: 1,
        backgroundColor: '#008000', // Set the background color to green
        justifyContent: 'flex-start', // Align items from the top of the page
        alignItems: 'center',
    },
    image: {
        width: 190, // Set image to 70% of the screen width
        height: 190, // Set a fixed height for the image
        resizeMode: 'contain', // Ensure the image maintains aspect ratio
        marginTop: 60, // Add some margin at the top to give space
    },
    descriptionContainer: {
        marginTop: 110, // Add space between the image and the text
        width: '105%',
        height: '75%', // Increase height for better visibility
        borderRadius: 40,
        backgroundColor: 'white',
        padding: 15, // Add padding to give some space inside
    },
    topicText: {
        fontWeight: 'bold', // Make the text bold
        fontSize: 20, // Increase the font size for better visibility
        marginBottom: 10, // Add some margin below the topic text
        marginTop: 10,
        marginLeft: 10
    },
    scrollView: {
        flex: 1, // Allow scrollable content to fill remaining space
    },
    lessonText: {
        fontSize: 15, // Slightly smaller size for body text
        textAlign: 'justify', // Justify the text
        marginLeft: 20,
        marginRight: 20
    }
});
