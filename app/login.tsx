import {
    Image,
    StyleSheet,
    TextInput,
    Modal,
    View,
    Pressable,
    Text,
    ImageBackground
 } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const router = useRouter();
    const login = (username, password) => {
        if (username == "admin" && password == "password") {
            router.replace("/profile");
        } else {
            console.log("Invalid");
            // setModalVisible(!modalVisible);
        }
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.backgroundImage}/>
            {/* PAGEVIEW */}
            <Image style = {styles.logo} source={require('@/assets/images/geosphere.png')} />
            <div style = {styles.centerContainer}>
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
                <Pressable
                    style={styles.loginButton}
                    onPress={ () => login(username, password) }
                >
                    <Text>Log in</Text>
                </Pressable>
                <div style = {styles.registerContainer}>
                    <Text style ={styles.accountColor}>
                        Don't have an Account? <Link style={styles.registerButton} href="/register">Register</Link>
                    </Text>
                </div>
            </div>
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
                        <p>
                            Invalid username/password!
                        </p>
                    </View>
                </View>
            </Modal>
            {/* END OF MODAL */}
        </div>
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
        margin: 100
        
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
        textDecorationLine: 'none'
    },
    logo: {
        width: 250,
        height: 250, 
        margin: 15
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: '#228b22',
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
        fontWeight: 'bold'
    },
    accountColor:{
        color: '#ffffff'
    }
    
})