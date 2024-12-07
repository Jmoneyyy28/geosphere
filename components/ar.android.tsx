import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingStateConstants,
} from "@viro-community/react-viro";
import { useLocalSearchParams } from "expo-router";

export default function ArScreen() {
  const [title, setTitle] = useState(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log("params", params);
    setTitle(params.title);
  }, [params.title]);

  const onInitialized = (state, reason) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("AR tracking normal");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      console.log("AR tracking lost");
    }
  };

  const getEarthStructure = () => {
    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={500} />
        <Viro3DObject
          source={require("@/assets/3d-models/earthlayers/earth-layers.obj")}
          resources={[
            require("@/assets/3d-models/earthlayers/earth-layersMaterials.mtl"),
            require("@/assets/3d-models/earthlayers/Tex_1.jpg"),
            require("@/assets/3d-models/earthlayers/Tex_2.png"),
            require("@/assets/3d-models/earthlayers/Tex_3.jpg"),
            require("@/assets/3d-models/earthlayers/Tex_4.jpg"),
          ]}
          position={[0, 0, -1]}
          scale={[0.5, 0.5, 0.5]}
          rotation={[0, 90, 0]}
          type="OBJ"
        />
      </ViroARScene>
    );
  };

  const getPlateBoudaries = () => {
    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={500} />
        <ViroText
          text="Plate Boundaries"
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={styles.helloWorldTextStyle}
          dragType="FixedToWorld"
        />
      </ViroARScene>
    );
  };

  const models = {
    "Plate Boundaries": getPlateBoudaries(),
    "Internal Structures of the Earth": getEarthStructure(),
  };

  const getScene = () => {
    return models[title];
  };

  return title ? (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{ scene: getScene }}
      style={{ flex: 1 }}
    />
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>Loading</Text>
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
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
