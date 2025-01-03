import { Image, StyleSheet, TextInput, Modal, View, Text } from "react-native";
import React from "react";
import { Link, useRouter, useNavigation } from "expo-router";
import { useEffect } from "react";
import { GeoButton } from "@/components/GeoButton";
import axios from "axios";

import { StorageService } from "@/services/StorageService";

axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
const LOGIN_ENDPOINT = "authentication/login";

export default function LoginScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const login = (username, password) => {
    axios({
      url: LOGIN_ENDPOINT,
      method: "post",
      data: {
        username: username,
        password: password,
      },
    }).then((res) => {
      const student = res.data[0];
      if (student) {
        StorageService.storeData("profile", student);
        router.replace({ pathname: "/profile" });
      } else {
        console.log("invalid");
      }
    });
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.backgroundImage} />
      {/* PAGEVIEW */}
      <Image
        style={styles.logo}
        source={require("@/assets/images/geosphere.png")}
      />
      <View style={styles.centerContainer}>
        <Text style={styles.welcomeColor}>Welcome!</Text>
        <TextInput
          style={styles.borderUnderline}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          placeholderTextColor={"#ffffff"}
        />
        <TextInput
          style={styles.borderUnderline}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholderTextColor={"#ffffff"}
        />
        <GeoButton
          name="Log In"
          theme="light"
          style={styles.loginButton}
          textStyle={styles.loginText}
          onPress={() => login(username, password)}
        ></GeoButton>

        <View style={styles.registerContainer}>
          <Text style={styles.accountColor}>
            Don't have an Account?{" "}
            <Link style={styles.registerButton} href="/register">
              Register
            </Link>
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
            <Text>Invalid username/password!</Text>
          </View>
        </View>
      </Modal>
      {/* END OF MODAL */}
    </View>
  );
}

const styles = StyleSheet.create({
  geoDescription: {
    justifyContent: "center",
    alignSelf: "center",
  },
  loginText: {
    fontFamily: "Roboto_500Medium",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    // backgroundColor: '#84b522',
    flexDirection: "column",
  },
  centerContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 50,
    margin: 10,
  },
  loginButton: {
    borderRadius: 50,
    width: 250,
    height: 45,
  },
  registerContainer: {
    margin: 20,
  },
  registerButton: {
    color: "blue",
    fontFamily: "Roboto_100Thin",
  },
  logo: {
    width: 350,
    height: 350,
    margin: 20,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: "#008000",
    position: "absolute",
    top: 370,
    height: 1600,
    width: 1300,
    borderRadius: 3500,
    zIndex: -1000,
  },
  borderUnderline: {
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: "#ffffff",
    margin: 20,
  },
  welcomeColor: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Roboto_900Black",
  },
  accountColor: {
    color: "#ffffff",
    fontFamily: "Roboto_100Thin",
  },
});
