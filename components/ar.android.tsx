import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Viro3DObject,
  ViroAmbientLight,
  ViroOmniLight,
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingStateConstants,
  ViroAnimations,
  ViroQuad,
  ViroBox,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from "@viro-community/react-viro";
import { useLocalSearchParams } from "expo-router";

export default function ArScreen() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState(null);
  const [plate1Animation, setPlate1Animation] = useState("movePositive");
  const [plate2Animation, setPlate2Animation] = useState("moveNegative");
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setTitle(params.title);
  }, [params.title]);

  const onInitialized = (state, reason) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("AR tracking normal");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      console.log("AR tracking lost");
    }
  };

  const plate1AnimationEnd = () => {
    console.log("Plate 1 animation end");
    console.log(plate1Animation);
    setPlate1Animation("moveNegative");
    // if (plate1Animation === "movePositive") {
    //   setPlate1Animation("moveNegative");
    // } else {
    //   setPlate1Animation("movePositive");
    // }
  };

  const plate2AnimationEnd = () => {
    console.log("Plate 2 animation end");
    if (plate2Animation === "movePositive") {
      setPlate2Animation("moveNegative");
    } else {
      setPlate2Animation("movePositive");
    }
  };

  const onLoadModel = () => {
    console.log("Model loaded");
    setAnimationStarted(true);
  }

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

  const getPlateBoundaries = () => {
    ViroAnimations.registerAnimations({
      movePositive: {
        properties: {
          positionZ: "+= 0.03", // Move to the right
        },
        duration: 5000, // 3 seconds
      },
      moveNegative: {
        properties: {
          positionZ: "-= 0.03",// Move to the left
        },
        duration: 5000, // 3 seconds
      },
      resetPosition: {
        properties: {
          positionZ: 0,
        },
        duration: 2000,
      },
      movePositive2: {
        properties: {
          positionX: "+= 0.03", // Move to the right
        },
        duration: 5000, // 3 seconds
      },
      moveNegative2: {
        properties: {
          positionX: "-= 0.03",// Move to the left
        },
        duration: 5000, // 3 seconds
      },
      resetPosition2: {
        properties: {
          positionX: 0,
        },
        duration: 2000,
      },
      movePositive3: {
        properties: {
          positionX: "+= 0.03", // Move to the right
          positionY: "-= 0.01",

        },
        duration: 5000, // 3 seconds
      },
      moveNegative3: {
        properties: {
          positionX: "-= 0.03",// Move to the left 
          positionY: "+= 0.01",
        },
        duration: 5000, // 3 seconds
      },
      resetPosition3: {
        properties: {
          positionX: 0,
          positionY: 0
        },
        duration: 2000,
      },
      resetPosition4: {
        properties: {
          positionX: 0
        },
        duration: 2000,
      },
      moveLoop: [["movePositive", "resetPosition"]],
      moveLoop2: [["moveNegative", "resetPosition"]],
      moveLoop3: [["movePositive2", "resetPosition2"]],
      moveLoop4: [["moveNegative2", "resetPosition2"]],
      moveLoop5: [["movePositive3", "resetPosition3"]],
      moveLoop6: [["moveNegative3", "resetPosition4"]],

    });

    ViroARTrackingTargets.createTargets({
      logo : {
        source : require('@/assets/images/icon.png'),
        orientation : "Up",
        physicalWidth : 0.165 // real world width in meters
      }
    });

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={500} />
        <ViroARImageMarker target={'logo'}>
      
        {/* Plate 1 - Starting slightly left */}
        {/* <Viro3DObject
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.png"),
          ]}
          position={[0.18, 0, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 100, 0]}
          type="OBJ"
          onLoadEnd={onLoadModel}
          animation={{
            name: "moveLoop",
            run: true,
            loop: true,
            onFinish: plate1AnimationEnd,
          }}
        />

        {/* Plate 2 - Starting slightly right */}
        {/* <Viro3DObject
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.png"),
          ]}
          position={[-0.18, 0, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 100, 0]}
          type="OBJ"
          onLoadEnd={onLoadModel}
          animation={{
            name: "moveLoop2",
            run: true,
            loop: true,
            onFinish: plate2AnimationEnd,
          }}
        /> */}

         {/* <Viro3DObject
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.png"),
          ]}
          position={[0.18, 0, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 100, 0]}
          type="OBJ"
          onLoadEnd={onLoadModel}
          animation={{
            name: "moveLoop3",
            run: true,
            loop: true,
            onFinish: plate1AnimationEnd,
          }}
        />


        <Viro3DObject
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.png"),
          ]}
          position={[-0.18, 0, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 100, 0]}
          type="OBJ"
          onLoadEnd={onLoadModel}
          animation={{
            name: "moveLoop4",
            run: true,
            loop: true,
            onFinish: plate2AnimationEnd,
          }}
        /> */}
        <Viro3DObject
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.png"),
          ]}
          position={[0.25, 0.1, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 0, -10]}
          type="OBJ"
          onLoadEnd={onLoadModel}
          animation={{
            name: "moveLoop6",
            run: true,
            loop: true,
            onFinish: plate1AnimationEnd,
          }}
        />


        <Viro3DObject
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj/Coastal_Cross_Section_1208065723_texture.png"),
          ]}
          position={[-0.25, 0.1, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 0, -10]}
          type="OBJ"
          onLoadEnd={onLoadModel}
          animation={{
            name: "moveLoop5",
            run: true,
            loop: true,
            onFinish: plate2AnimationEnd,
          }}
        />
        </ViroARImageMarker>
      </ViroARScene>
    );
  };

  const getLandforms = () => {
    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={500} />
        <Viro3DObject
          source={require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture.mtl"),
            require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture.png"),
          ]}
          position={[0, 0, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 100, 0]}
          type="OBJ"
        />
      </ViroARScene>
    );
  };

  const models = {
    "Plate Boundaries": getPlateBoundaries(),
    "Internal Structures of the Earth": getEarthStructure(),
    "Processes and Landforms": getLandforms(),
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
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    height: 50,
  },
  scrollContent: {
    flexDirection: "row",
  },
  scrollPlaceholder: {
    width: 1000, // Large enough to enable scrolling
    height: 50,
    backgroundColor: "#cccccc", // Add a visible background for debugging
  },
});
