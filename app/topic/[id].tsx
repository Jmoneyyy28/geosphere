import {
    StyleSheet,
    Text
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
            "name": "Plate Boudaries"
        },
        "2": {
            "name": "Internal Structures of the Earth"
        },
        "3": {
            "name": "Processes and Landforms"
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
        <>
            <Text>{topic.name}</Text>
        </>
    );
}

const styles = StyleSheet.create({
  test: {

  }
});
