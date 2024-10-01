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

export default function TopicScreen() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();

    const topics = {
        "1": {
            "name": "Plate Boundaries",
            "lesson": "Plate boundaries are the areas where Earth's tectonic plates interact, leading to significant geological activity. There are three main types of plate boundaries. Divergent boundaries occur when plates move apart, allowing magma to rise and create new crust, as seen in the Mid-Atlantic Ridge. Convergent boundaries form when plates collide, often resulting in the formation of mountains or subduction zones, where one plate sinks beneath another, like the Himalayas. Transform boundaries happen when plates slide past each other horizontally, leading to earthquakes, such as along the San Andreas Fault. These boundaries play a crucial role in shaping Earth's surface."
        },
        "2": {
            "name": "Internal Structures of the Earth",
            "lesson": "The Earth’s internal structure consists of four main layers. The outermost layer, the crust, is thin and solid, forming both continental and oceanic plates. Beneath the crust is the mantle, a semi-solid layer of silicate rocks that extends deep into the Earth, with convection currents driving tectonic activity. Below the mantle is the outer core, made of liquid iron and nickel, which generates Earth's magnetic field. At the center is the inner core, a solid sphere of iron and nickel, kept solid despite high temperatures due to immense pressure."
        },
        "3": {
            "name": "Processes and Landforms",
            "lesson": "Earth's surface is shaped by various processes. Tectonic activity forms mountains, volcanoes, and causes earthquakes. Erosion and weathering break down rocks, creating valleys and canyons. Volcanic activity produces landforms like volcanoes and islands. River and glacial processes carve landscapes, forming features such as deltas, meanders, and glacial valleys. These processes continually reshape the Earth."
        }
    }

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const getTopic = (id) => {
        return topics[id];
    }

    const topic = getTopic(id);

    return (
        <View style={styles.container}>
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
    container: {
        flex: 1,
        backgroundColor: 'green', // Set the background color to green
        justifyContent: 'center',
        alignItems: 'center',
    },
    descriptionContainer: {
        position: 'absolute', // Position it absolutely
        bottom: 75, // Align it to the bottom
        width: '90%',
        height: '25%',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 15, // Add padding to give some space inside
    },
    topicText: {
        fontWeight: 'bold', // Make the text bold
        fontSize: 20, // Increase the font size for better visibility
        marginBottom: 10, // Add some margin below the topic text
    },
    scrollView: {
        flex: 1, // Allow scrollable content to fill remaining space
    },
    lessonText: {
        fontSize: 14, // Slightly smaller size for body text
        textAlign: 'justify', // Justify the text
    }
});