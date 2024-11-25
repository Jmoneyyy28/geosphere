import { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
  Viro3DObject,
} from "@viro-community/react-viro";

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing AR...");

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("guncelleme", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("Hello World!");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }
  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      /> */}
      <Viro3DObject
        source={require("@/assets/3d-models/earth-core/earth_core2.obj")}
        resources={[
          require("@/assets/3d-models/earth-core/11415.jpg"),
          require("@/assets/3d-models/earth-core/color_etopo1_ice_low.jpg"),
          require("@/assets/3d-models/earth-core/generic_lava.png"),
          require("@/assets/3d-models/earth-core/landscape_texture.jpg"),
          require("@/assets/3d-models/earth-core/maxresdefault.jpg"),
          require("@/assets/3d-models/earth-core/Sg3grB.jpg"),
          require("@/assets/3d-models/earth-core/WaterPlain0012_2_download600.jpg"),
        ]}
        position={[0, 0, -1]}
        scale={[0.5, 0.5, 0.5]}
        rotation={[0, 90, 0]}
        type="OBJ" />
    </ViroARScene>
  );
};

export default function ArScreen() {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={{flex: 1}}
    />
    // <View style={styles.container}>
      
    // </View>
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
