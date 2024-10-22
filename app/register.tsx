import {
    Image,
    StyleSheet,
    TextInput,
    Modal,
    View,
    Pressable,
    Text,
    ImageBackground,
    TouchableHighlight
 } from 'react-native';
import React from 'react';
import { Link, useNavigation, useLocalSearchParams} from 'expo-router';
import { useEffect } from 'react';
import { GeoButton } from '@/components/GeoButton';

export default function RegisterScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [idnumber, setIdnumber] = React.useState('');
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = React.useState(false);
    const signin = () => {
        console.log ("Invalid");
        //setModalVisible(!modalVisible);
    }
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);
    return (
        <View style={styles.mainContainer}>
            <View style={styles.backgroundImage}/>
            {/* PAGEVIEW */}
            <Image style = {styles.logo} source={require('@/assets/images/geosphere.png')} />
            <View style = {styles.centerContainer}>
                <Text style = {styles.registerColor}>
                    Register!
                </Text>
                <TextInput style = {styles.borderUnderline}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
                    placeholderTextColor={'#ffffff'}
                    
                />
                <TextInput style = {styles.borderUnderline}
                    placeholder='ID Number'
                    onChangeText={setIdnumber}
                    value={idnumber}
                    placeholderTextColor={'#ffffff'}
                />
                <TextInput style = {styles.borderUnderline}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    placeholderTextColor={'#ffffff'}
                />
                <GeoButton name='Sign Up' theme='light' style={styles.signinButton} textStyle={styles.signupText} onPress={signin}></GeoButton>
                <View style = {styles.registerContainer}>
                    <Text style ={styles.accountColor}>
                        Already have an account? <Link style = {styles.registerButton} href = "/login">Log in</Link>
                    </Text>
                </View>
            </View>
            {/* END OF PAGEVIEW */}

            {/* BACKGROUND */}
            {/* <ImageBackground style={styles.backgroundImage} source={require('@/assets/images/backgroundimage.png')} resizeMode="cover"/> */}
            {/* END OF BACKGROUND */}

            {/* MODAL */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>
                            Registered!
                        </Text>
                    </View>
                </View>
            </Modal>
            {/* END OF MODAL */}
        </View>
    )
};

const styles = StyleSheet.create({
    signupText: {
        fontFamily: 'Roboto_500Medium'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        // backgroundColor: '#84b522',
        flexDirection: 'column',
        
        
    },
    centerContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 200,
        margin: 10
    },
    signinButton: {
        borderRadius: 50,
        width: 250,
        height: 45,
        marginTop: 5
    },
    registerContainer: {
        margin: 20,
    },
    registerButton: {
        color: 'blue',
        fontFamily: 'Roboto_100Thin'
    },
    logo: {
        width: 350,
        height: 350, 
        margin: 20
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: '#008000',
        position: 'absolute',
        top: 370,
        height: 1600,
        width: 1300,
        borderRadius: 3500,
        zIndex: -1000
    },
    borderUnderline: {
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderColor: '#ffffff',
        margin: 15,
        fontFamily: 'sans-serif'
    },
    registerColor: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Roboto_900Black',
        marginBottom: 10
    },
    accountColor:{
        color: '#ffffff',
        fontFamily: 'Roboto_100Thin'
    }
    
})