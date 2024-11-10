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

import { useEffect, useState } from 'react';
import { GeoButton } from '@/components/GeoButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
<<<<<<< HEAD
=======
import { Audio } from 'expo-av';
>>>>>>> ddffe0ab24957cd102b5f6bfa2d69dec3cc17bc7

export default function TopicScreen() {
    const [sound, setSound] = useState();

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

    const playSound =  async () => {
        const { sound } = await Audio.Sound.createAsync( require('@/assets/sounds/test.mp3') );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();

    }

    const goToQuiz = () => {
        console.log('asd');
        router.replace({pathname: '/quiz', params: {topic_id: id}});
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
<<<<<<< HEAD
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
                        <Text style={styles.lessonText}>{topic.lesson}</Text>
                    </ScrollView>
                </View>
            </View>
        </ScrollView>
=======
                    <View style={styles.optionContainer}>
                        <GeoButton name="take quiz" onPress={() => goToQuiz()} />
                        <GeoButton 
                            onPress={backTopic}
                            theme='transparent'>
                                <Ionicons
                                    name="cube"
                                    style={styles.optionIcon}
                                />
                        </GeoButton>
                        <GeoButton 
                            onPress={() => playSound()}
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
>>>>>>> ddffe0ab24957cd102b5f6bfa2d69dec3cc17bc7
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#008000',
        alignItems: 'center',
        paddingTop: 40,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 20,
        left: 25,
        zIndex: 1,
    },
    backIcon: {
        fontSize: 28,
        color: '#ffffff',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 15,
        marginTop: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    optionContainer: {
        position: 'absolute',
        top: 350,
        right: 20,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 25,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    optionIcon: {
        fontSize: 28,
        color: '#008000',
        marginHorizontal: 8,
    },
    descriptionContainer: {
        marginTop: 120,
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    topicText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    scrollView: {
        flex: 1,
        marginTop: 5,
    },
    lessonText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        textAlign: 'justify',
    },
});