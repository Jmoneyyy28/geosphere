import { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
  Viro3DObject,
  ViroMaterials,
  ViroAmbientLight,
  ViroAnimations
} from "@viro-community/react-viro";


const AR_MODEL = {
  "InternalStructureOfTheEarth": require("@/assets/3d-models/earth-core/earth_core2.obj"),
  "ProcessesAndLandforms": require("@/assets/3d-models/earth-core/earth_core2.obj"),
}
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
         <ViroAmbientLight color="#ffffff" intensity={500}/>
      {/* <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      /> */}
      <Viro3DObject
        source={require("@/assets/3d-models/convergentBoundary/scene.gltf")}
        resources={[
          require("@/assets/3d-models/convergentBoundary/sceneBin.bin"),
          require("@/assets/3d-models/convergentBoundary/textures/material_0_diffuse.png"),
          require("@/assets/3d-models/convergentBoundary/textures/material_0_normal.png"),
          require("@/assets/3d-models/convergentBoundary/textures/material_0_occlusion.png"),
          require("@/assets/3d-models/convergentBoundary/textures/material_0_specularGlossiness.png"),
          require("@/assets/3d-models/convergentBoundary/textures/material_1_diffuse.png"),
          require("@/assets/3d-models/convergentBoundary/textures/material_1_normal.png"),
          require("@/assets/3d-models/convergentBoundary/textures/material_1_occlusion.png"),
          require("@/assets/3d-models/convergentBoundary/textures/material_1_specularGlossiness.png"),
        ]}
        animation={{
          name: 'thrust',
          run: true,
          loop: true,
          delay: 3000

        }}
        position={[0, 0, -1]}
        scale={[0.3, 0.3, 0.3]}
        rotation={[0, 90, 0]}
        type="GLTF" />

    {/* <Viro3DObject
        source={require("@/assets/3d-models/test/dragon_animation.glb")}
        position={[0, 0, -1]}
        scale={[0.03, 0.03, 0.03]}
        animation={{
          name: 'Scene',
          run: true,
          loop: true,
          delay: 3000
        }}
        rotation={[0, 90, 0]}
        type="GLB" /> */}
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
