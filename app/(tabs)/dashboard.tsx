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

export default function DashboardScreen() {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.plateContainer}>
               <Text style={styles.textColor}>Plate Tectonic Topics</Text>
            </View>
            <Pressable style={styles.plateTectonicButton}>
                <Text style={styles.textColor}>Plate Boudaries</Text>
            </Pressable>
            <Pressable style={styles.plateTectonicButton}>
                <Text style={styles.textColor}>Internal Structures of the Earth</Text>
            </Pressable>
            <Pressable style={styles.plateTectonicButton}>
                <Text style={styles.textColor}>Processes and Landforms</Text>
            </Pressable>
        </View>

        
        
    )
};

const styles = StyleSheet.create({

    plateTectonicButton:{
        backgroundColor: '#84b522',
        borderRadius: 20,
        width: 250,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginTop: 40,
        borderStyle: 'solid',
        borderWidth: 1
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        backgroundColor: '#228b22',
        flexDirection: 'column',
    },
    plateContainer:{
        width: 370,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#84b522',
        marginTop: 90,
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10}
    },
    textColor:{
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    }
    
})