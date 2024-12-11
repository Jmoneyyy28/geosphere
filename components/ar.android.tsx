import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
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
  ViroARPlaneSelector,
  ViroARPlane,
} from "@viro-community/react-viro";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { GeoButton } from "./GeoButton";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Ionicons } from "@expo/vector-icons";


export default function ArScreen() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState(null);
  const [plateBoundariesType, setPlateBoundariesType] = useState("transform");
  const [plate1Animation, setPlate1Animation] = useState("movePositive");
  const [plate2Animation, setPlate2Animation] = useState("moveNegative");
  const [animationStarted, setAnimationStarted] = useState(false);
  const [scene, setScene] = useState(null);
  const [object, setObject] = useState("transform");
  const [rotate, setRotate] = useState(false);
  const [rotationDirection, setRotationDirection] = useState("rotateRight");


  useEffect(() => {
    setPlateBoundariesType("transform");
    setTitle(params.title);
  }, [params.title]);

  const onInitialized = (state, reason) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("AR tracking normal");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      console.log("AR tracking lost");
    }
  };

  const changeScene = (type) => {
    console.log(type);
    setPlateBoundariesType(type);
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
  };

  const getEarthStructure = (props) => {
    if (!props) {
      return;
    }
    console.log(props);
    const data = props.arSceneNavigator.viroAppProps;

    ViroAnimations.registerAnimations({
      rotate: {
        properties: {
          rotateY: "+=10",
        },
        duration: 1000,
      },
      rotateRight: {
        properties: {
          rotateY: "+=20",
        },
        duration: 500,
      },
      rotateLeft: {
        properties: {
          rotateY: "-=20",
        },
        duration: 500,
      },
    });

    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={1000} />
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
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 20, 0]}
          animation={{
            name: data.rotationDirection,
            run: data.rotate,
            onFinish: animationEnd,
          }}
          type="OBJ"
        />
      </ViroARScene>
    );
  };

  const getDivergentBoundaries = () => {
    ViroAnimations.registerAnimations({
      movePositive2: {
        properties: {
          positionX: "+= 0.03", // Move to the right
        },
        duration: 5000, // 3 seconds
      },
      moveNegative2: {
        properties: {
          positionX: "-= 0.03", // Move to the left
        },
        duration: 5000, // 3 seconds
      },
      resetPosition2: {
        properties: {
          positionX: 0,
        },
        duration: 2000,
      },
      moveLoop3: [["movePositive2", "resetPosition2"]],
      moveLoop4: [["moveNegative2", "resetPosition2"]],
    });

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={1000} />
        <Viro3DObject
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
        />
      </ViroARScene>
    );
  };

  const getConvergentBoundaries = () => {
    ViroAnimations.registerAnimations({
      movePositive3: {
        properties: {
          positionX: "+= 0.03", // Move to the right
          positionY: "-= 0.01",
        },
        duration: 5000, // 3 seconds
      },
      moveNegative3: {
        properties: {
          positionX: "-= 0.03", // Move to the left
          positionY: "+= 0.01",
        },
        duration: 5000, // 3 seconds
      },
      resetPosition3: {
        properties: {
          positionX: 0,
          positionY: 0,
        },
        duration: 2000,
      },
      resetPosition4: {
        properties: {
          positionX: 0,
        },
        duration: 2000,
      },
      moveLoop5: [["movePositive3", "resetPosition3"]],
      moveLoop6: [["moveNegative3", "resetPosition4"]],
    });

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={1000} />
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
      </ViroARScene>
    );
  };

  const getPlateBoundaries = (props) => {
    const data = props.arSceneNavigator.viroAppProps;
    console.log(data.object);

    ViroAnimations.registerAnimations({
      movePositive: {
        properties: {
          positionZ: "+= 0.05", // Move to the right
        },
        duration: 3000, // 3 seconds
      },
      moveNegative: {
        properties: {
          positionZ: "-= 0.05", // Move to the left
        },
        duration: 3000, // 3 seconds
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
        duration: 3000, // 3 seconds
      },
      moveNegative2: {
        properties: {
          positionX: "-= 0.03", // Move to the left
        },
        duration: 3000, // 3 seconds
      },
      resetPosition2: {
        properties: {
          positionX: 0,
        },
        duration: 2000,
      },
      movePositive3: {
        properties: {
          positionX: "+= 0.02", // Move to the right
          positionY: "-= 0.001",
        },
        duration: 7000, // 3 seconds
      },
      moveNegative3: {
        properties: {
          positionX: "-= 0.02", // Move to the left
          positionY: "+= 0.001",
        },
        duration: 7000, // 3 seconds
      },
      resetPosition3: {
        properties: {
          positionX: 0,
          positionY: "+= 0.001",
        },
        duration: 2000,
      },
      resetPosition4: {
        properties: {
          positionX: 0,
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

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={1000} />
        {data.object === "transform" ? (
          <>
            <Viro3DObject
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
                name: "moveLoop2",
                run: true,
                loop: true,
                onFinish: plate2AnimationEnd,
              }}
            />
          </>
        ) : data.object === "divergent" ? (
          <>
            <Viro3DObject
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
            />
          </>
        ) : (
          <>
            <Viro3DObject
              source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.obj")}
              resources={[
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.mtl"),
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj/Coastal_Cross_Section_1208065716_texture.png"),
              ]}
              position={[0.28, 0.1, -1]}
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
              position={[-0.28, 0.1, -1]}
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
          </>
        )}
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
        /> */}

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
      </ViroARScene>
    );
  };

  const getLandforms = (props) => {
    if (!props) {
      return;
    }

    const data = props.arSceneNavigator.viroAppProps;

    ViroAnimations.registerAnimations({
      rotate: {
        properties: {
          rotateY: "+=10",
        },
        duration: 1000,
      },
      rotateRight: {
        properties: {
          rotateY: "+=20",
        },
        duration: 500,
      },
      rotateLeft: {
        properties: {
          rotateY: "-=20",
        },
        duration: 500,
      },
    });

    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroAmbientLight color="#ffffff" intensity={1000} />
        <Viro3DObject
          source={require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture.obj")}
          resources={[
            require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture.mtl"),
            require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture.png"),
          ]}
          position={[0, 0, -1]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 1, 0]}
          animation={{
            name: data.rotationDirection,
            run: data.rotate,
            onFinish: animationEnd,
          }}
          type="OBJ"
        />
      </ViroARScene>
    );
  };

  const models = {
    "Internal Structures of the Earth": getEarthStructure(),
    "Processes and Landforms": getLandforms(),
  };

  const getScene = (props) => {
    return models[title];
  };

  const animationEnd = () => {
    setRotate(false);
  };

  const rotateEarthStructure = (direction) => {
    console.log("Rotate", rotate);
    setRotate(!rotate);
    setRotationDirection(direction);
  };

  if (!title) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading</Text>
      </View>
    );
  }

  if (title === "Plate Boundaries") {
    return (
      <View style={styles.mainContainer}>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: getPlateBoundaries,
          }}
          style={{ flex: 1 }}
          viroAppProps={{ object: object }}
        />   
        <View style={styles.controlVIew}>
          <View>
            <Text style={styles.titleStyle}>{object} Boundaries</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <GeoButton
              style={styles.buttonStyle}
              onPress={() => setObject("convergent")}
            >
              <Text style={{color:"#ffffff", fontFamily: "Roboto_300Light"}}>Convergent</Text>
            </GeoButton>
            <GeoButton
              style={styles.buttonStyle}
              onPress={() => setObject("divergent")}
            >
              <Text style={{color: "#ffffff", fontFamily: "Roboto_300Light"}}>Divergent</Text>
            </GeoButton>
          </View>
        </View>
      </View>
    );
  } else if (title === "Internal Structures of the Earth") {
    return (
      <View style={styles.mainContainer}>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: getEarthStructure,
          }}
          style={{ flex: 1}}
          viroAppProps={{
            object: object,
            rotate: rotate,
            rotationDirection: rotationDirection,
          }}
        />
        <View style={styles.controlVIew}>
          <View>
            <Text style={styles.titleStyle}>{title}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          
          <GeoButton
            onPress={() => rotateEarthStructure("rotateLeft")}
          >
            <Ionicons name="chevron-back-outline"
              style = {styles.rotateButton}/>
          </GeoButton>
          <Text style={styles.rotateTextStyle}> Tap to Rotate the Model!</Text>
          <GeoButton
            onPress={() => rotateEarthStructure("rotateRight")}
          >
            <Ionicons name="chevron-forward-outline"
            style = {styles.rotateButton}/>
            </GeoButton>
          </View>
        </View>
      </View>
    );
  } else if (title === "Processes and Landforms") {
    return (
      <View style={styles.mainContainer}>
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: getLandforms,
          }}
          style={{ flex: 1 }}
          viroAppProps={{
            object: object,
            rotate: rotate,
            rotationDirection: rotationDirection,
          }}
        />
        <View style={styles.controlVIew}>
          <View>
            <Text style={styles.titleStyle}>{title}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <GeoButton
            onPress={() => rotateEarthStructure("rotateLeft")}
          >
            <Ionicons name="chevron-back-outline"
              style = {styles.rotateButton}/>
          </GeoButton>
          <Text style={styles.rotateTextStyle}>Tap to Rotate the Model!</Text>
          <GeoButton
            onPress={() => rotateEarthStructure("rotateRight")}
          >
            <Ionicons name="chevron-forward-outline"
            style = {styles.rotateButton}/>
            </GeoButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  optionIcon: {
    fontSize: 28,
    color: "#008000",
    marginHorizontal: 8,
  },
  rotateTextStyle: {
    fontSize: 15,
    color: "#ffffff",
    fontFamily: "Roboto_300Light",
  },
  rotateButton: {
    fontSize: 50,
    color: "#ffffff",
    margin: 10
  },
  earthButton: {
    backgroundColor: "green",
    borderRadius: 30,
    height: 35,
    width: 100,
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
  },
  titleStyle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
  },
  buttonStyle: {
    backgroundColor: "#4CBB17",
    borderRadius: 30,
    margin: 10,
    height: 35,
    width: 100,
    justifyContent: "center",
    alignContent: "center",
  },
  mainContainer: {
    flex: 1,
  },
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
  controlVIew: {
    width: "100%",
    height: 120,
    backgroundColor: "#008000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
