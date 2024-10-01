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
import { Link, useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function LoginScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const navigation = useNavigation();
    const router = useRouter();
    const login = (username, password) => {
        if (username == "admin" && password == "password") {
            router.replace("/profile");
        } else {
            console.log("Invalid");
            // setModalVisible(!modalVisible);
        }
        
    };
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.backgroundImage}/>
            {/* PAGEVIEW */}
            <Image style = {styles.logo} source={require('@/assets/images/geosphere.png')} />
            <View style = {styles.centerContainer}>
                <Text style ={styles.welcomeColor}>
                    Welcome!
                </Text>
                <TextInput style = {styles.borderUnderline}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
                    placeholderTextColor={'#ffffff'}
                />
                <TextInput style = {styles.borderUnderline}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                    placeholderTextColor={'#ffffff'}
                />
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="white"
                    style={styles.loginButton}
                    onPress={ () => login(username, password) }
                >
                    <Text>Log in</Text>
                </TouchableHighlight>
                <View style = {styles.registerContainer}>
                    <Text style ={styles.accountColor}>
                        Don't have an Account? <Link style={styles.registerButton} href="/register">Register</Link>
                    </Text>
                </View>
            </View>
            {/* END OF PAGEVIEW */}

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
                            Invalid username/password!
                        </Text>
                    </View>
                </View>
            </Modal>
            {/* END OF MODAL */}
        </View>
    )
};

const styles = StyleSheet.create({
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
        height: 50,
        margin: 130
        
    },
    loginButton: {
        backgroundColor: '#ffff',
        borderRadius: 50,
        width: 250,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 10,  
    },
    registerContainer: {
        margin: 20
    },
    registerButton: {
        color: 'blue',
        fontFamily: 'sans-serif'
    },
    logo: {
        width: 250,
        height: 250, 
        margin: 15
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
        margin: 20
    },
    welcomeColor: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'sans-serif'
    },
    accountColor:{
        color: '#ffffff'
    }
    
})