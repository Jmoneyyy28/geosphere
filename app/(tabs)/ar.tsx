import { View, Text, StyleSheet } from "react-native";

export default function ArScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AR Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
