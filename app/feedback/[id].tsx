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

export default function FeedbackScreen() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();

    const feedbacks = {
        "1": {
            "name": "plate boundaries",
            "feedback": "You did well"
        },
        "2": {
            "name": "James",
            "feedback": "bad"
        }
    }

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const getFeedback = (id) => {
        return feedbacks[id];
    }

    const feedback = getFeedback(id);

    return (
        <View style={styles.container}>
            <GeoButton name="ANOTHER BUTTON" />
            <View style={styles.descriptionContainer}>
                <Text style={styles.topicText}>{feedback.name}</Text>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.lessonText}> {feedback.feedback}</Text>
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