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

  ViroMaterials.createMaterials({
    wolf: {
      diffuseTexture: require("@/assets/3d-models/wolf/Wolf_Body.jpg")
    }
  })

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
         <ViroAmbientLight color="#ffffff" intensity={200}/>
      {/* <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      /> */}
      {/* <Viro3DObject
        source={require("@/assets/3d-models/earthlayers/earth-layers.obj")}
        resources={[
          require("@/assets/3d-models/earthlayers/earth-layersMaterials.mtl"),
          require("@/assets/3d-models/earthlayers/Tex_1.jpg"),
          require("@/assets/3d-models/earthlayers/Tex_2.png"),
          require("@/assets/3d-models/earthlayers/Tex_3.jpg"),
          require("@/assets/3d-models/earthlayers/Tex_4.jpg")
        ]}
        position={[0, 0, -1]}
        scale={[0.3, 0.3, 0.3]}
        rotation={[0, 90, 0]}
        type="OBJ" />
    </ViroARScene> */}

    <Viro3DObject
        source={require("@/assets/3d-models/convergent-boundary/Moving tectonic plates.glb")}
        resources={[
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_0.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_1.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_1@channels=A.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_2.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_3@channels=R.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_4.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_5.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_5@channels=A.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_6.png"),
          require("@/assets/3d-models/convergent-boundary/gltf_embedded_7@channels=R.png")
        ]}
        position={[0, 0, -1]}
        scale={[0.3, 0.3, 0.3]}
        rotation={[0, 90, 0]}
        type="GLB" />
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
