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
import { Audio } from 'expo-av';
import axios from "axios";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function TopicScreen() {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
    
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();

    const ENDPOINTS = {
        topics: "topics",
        badges: "badges",
        feedback: "feedback",
        lesson: "topics/lesson"
    };

    useEffect(() => {
        setLoading(true);
        getLesson();
    }, [params.topic_id]);


    const getLesson = () => {
        console.log(params.topic_id);
        axios({
          url: ENDPOINTS.lesson,
          method: "get", 
          params: { topic_id: params.topic_id },
        }).then((res) => {
            console.log(res.data);
          setLesson(res.data[0]);
          setLoading(false);
        });    
      console.log(params);
      };

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // Function to toggle sound (play/pause)
    const toggleSound = async () => {
        if (sound === null) {
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('@/assets/sounds/test.mp3')
            );
            setSound(newSound);
            await newSound.playAsync();
            setIsPlaying(true);
        } else if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
        } else {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
                setSound(null);
            }
            : undefined;
    }, [sound]);

    const backLesson = () => {
        router.replace("/profile");
    }

    const goToQuiz = () => {
        router.replace({ pathname: '/quiz', params: { lesson_id: lesson.id } });
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingPosition}>
                        <Image
                            style={{ height: 400, width: 400 }}
                            source={require('@/assets/images/loading.gif')}
                        />
                    </View>
                ) : (
                    <>
                        <View style={styles.backButtonContainer}>
                            <GeoButton onPress={backLesson} theme='transparent'>
                                <Ionicons name="arrow-back" style={styles.backIcon} />
                            </GeoButton>
                        </View>
                        <Image source={{ uri: lesson.lesson_picture}} style={styles.image} />
                        <View style={styles.optionContainer}>
                            <GeoButton onPress={goToQuiz} theme='transparent'>
                                <Ionicons name="book" style={styles.optionIcon} />
                            </GeoButton>
                            <GeoButton onPress={backLesson} theme='transparent'>
                                <Ionicons name="cube" style={styles.optionIcon} />
                            </GeoButton>
                            <GeoButton onPress={toggleSound} theme='transparent'>
                                <Ionicons
                                    name={isPlaying ? "volume-high-outline" : "volume-mute-outline"}
                                    style={styles.optionIcon}
                                />
                            </GeoButton>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.topicText}>{lesson.lesson_title}</Text>
                            <ScrollView style={styles.scrollView}>
                                <Text style={styles.lessonText}>{lesson.lesson}</Text>
                            </ScrollView>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingPosition: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
