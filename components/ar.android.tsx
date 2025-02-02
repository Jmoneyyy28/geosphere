import { useEffect, useState, useCallback} from "react";
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
  ViroNode,
  ViroImage,
  ViroPolyline,
  ViroOrbitCamera,
} from "@viro-community/react-viro";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { GeoButton } from "./GeoButton";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import React from "react";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import { transform } from "@babel/core";

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
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [innerModalVisible, setInnerModalVisible] = useState(false);
  const [outerModalVisible, setOuterModalVisible] = useState(false);
  const [mantleModalVisible, setMantleModalVisible] = useState(false);
  const [crustModalVisible, setCrustModalVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transformModalVisible, setTransformModalVisible] = useState(false);
  const [convergentModalVisible, setConvergentModalVisible] = useState(false);
  const [divergentModalVisible, setDivergentModalVisible] = useState(false);

  useEffect(() => {
    setPlateBoundariesType("transform");
    setTitle(params.title);
  }, [params.title]);

    useFocusEffect(
      useCallback(() => {
        return () => {
          stopSound(); // Ensure sound is stopped when leaving the page
        };
      }, [sound])
    );

    const AUDIO = {
      transformVoice: require("@/assets/sounds/transformAugmentedSound.mp3"),
      convergentVoice: require("@/assets/sounds/convergentAugmentedSound.mp3"),
      divergentVoice: require("@/assets/sounds/divergentAugmentedSound.mp3"),
      topic2Voice: require("@/assets/sounds/InternalAugmentedSound.mp3"),
      topic3Voice: require("@/assets/sounds/LandformAugmentedSound.mp3"),
    };

  const onInitialized = (state, reason) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("AR tracking normal");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      console.log("AR tracking lost");
    }
  };

  const playingSound = () => {
    if (title === "Processes and Landforms") {
      return AUDIO.topic3Voice;
    } else if (title === "Internal Structures of the Earth") {
      return AUDIO.topic2Voice;
    } else if (title === "Plate Boundaries") {
      if (object === "transform") {
        return AUDIO.transformVoice;
      } else if (object === "divergent") {
        return AUDIO.divergentVoice;
      } else if (object === "convergent") {
        return AUDIO.convergentVoice;
      }
    }
  };

   const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(playingSound());
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    };

    const stopSound = async () => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
    };

  const toggleSound = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      playSound();
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
  const exitModal = () => {
    setIsModalVisible(false);
    setInnerModalVisible(false);
  };

  const onClickModal = () => {
    console.log("Clicked");
    setIsModalVisible(true);
  };

  const onClickInnerModal = () => {
    console.log("Clicked Inner");
    setInnerModalVisible(true);
  };

  const onClickOuterModal = () => {
    console.log("Clicked Outer");
    setOuterModalVisible(true);
  };
  const onClickMantleModal = () => {
    console.log("Clicked Mantle");
    setMantleModalVisible(true);
  };
  const onClickCrustModal = () => {
    console.log("Clicked Crust");
    setCrustModalVisible(true);
  };
  const onClickTransformModal = () => {
    console.log("Clicked Transform");
    setTransformModalVisible(true);
  };
  const onClickConvergentModal = () => {
    console.log("Clicked Convergent");
    setConvergentModalVisible(true);
  };
  const onClickDivergentModal = () => {
    console.log("Clicked Divergent");
    setDivergentModalVisible(true);
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
      rotateRight2: {
        properties: {
          rotateY: "+=10",
          rotateZ: "+=10",
        },
        duration: 500,
      },
    });

    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroNode
          position={[0, 0, -1]}
          animation={{
            name: data.rotationDirection,
            run: data.rotate,
            onFinish: animationEnd,
          }}
        >
          <ViroImage
            scale={[0.28, 0.28, 0.28]}
            source={require("@/assets/3d-models/label/InnerCore.png")}
            position={[-0.63, .65, .1]}
            transformBehaviors={["billboard"]}
            onClick={onClickInnerModal}
          />
          <ViroImage
            scale={[0.28, 0.28, 0.28]}
            source={require("@/assets/3d-models/label/OuterCore.png")}
            position={[-0.35, 0.65, .1]}
            transformBehaviors={["billboard"]}
            onClick={onClickOuterModal}
          />
          <ViroImage
            scale={[0.28, 0.28, 0.28]}
            source={require("@/assets/3d-models/label/Mantle.png")}
            position={[0, 0.67, .1]}
            transformBehaviors={["billboard"]}
            onClick={onClickMantleModal}
            
          />
          <ViroImage
            scale={[0.28, 0.28, 0.28]}
            source={require("@/assets/3d-models/label/Crust.png")}
            position={[0.22, 0.76, .1]}
            transformBehaviors={["billboard"]}
            onClick={onClickCrustModal}
          />
          <ViroPolyline
            position={[0, 0, 0]}
            points={[
              [-0.60, 0.59, 0.1], //taas na line
              [-0.3, 0.1, 0.1], //ibaba na line
            ]}
            thickness={0.005}
          />
          <ViroPolyline
            position={[0, 0, 0]}
            points={[
              [-0.35, 0.6, 0.1], // taas na line
              [-0.15, 0.18, 0.1], //ibaba na line
            ]}
            thickness={0.005}
            // animation={{
            //   name: data.rotationDirection,
            //   run: data.rotate,
            //   onFinish: animationEnd,
            // }}
          />
          <ViroPolyline
            position={[0, 0, 0]}
            points={[
              [0, 0.6, 0.1], // taas na line
              [0, 0.3, 0.1], //ibaba na line
            ]}
            thickness={0.005}
            // animation={{
            //   name: data.rotationDirection,
            //   run: data.rotate,
            //   onFinish: animationEnd,
            // }}
          />
          <ViroPolyline
            position={[0, 0, 0]}
            points={[
              [0.21, 0.68, 0.1], // taas na line
              [0.15, 0.3, 0.1], //ibaba na line
            ]}
            thickness={0.005}
            // animation={{
            //   name: data.rotationDirection,
            //   run: data.rotate,
            //   onFinish: animationEnd,
            // }}
          />
          <ViroAmbientLight color="#ffffff" intensity={5000} />

          <Viro3DObject
            source={require("@/assets/3d-models/earthlayers/earth-layers.obj")}
            resources={[
              require("@/assets/3d-models/earthlayers/earth-layersMaterials.mtl"),
              require("@/assets/3d-models/earthlayers/Tex_1.jpg"),
              require("@/assets/3d-models/earthlayers/Tex_2.png"),
              require("@/assets/3d-models/earthlayers/Tex_3.jpg"),
              require("@/assets/3d-models/earthlayers/Tex_4.jpg"),
            ]}
            position={[0, 0, 0]}
            scale={[0.3, 0.3, 0.3]}
            rotation={[0, 20, 0]}
            // animation={{
            //   name: data.rotationDirection,
            //   run: data.rotate,
            //   onFinish: animationEnd,
            // }}
            type="OBJ"
            onClick={onClickModal}
          />
        </ViroNode>
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
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture1.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_mtl1.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_png1.png"),
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
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture2.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_mtl2.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_png2.png"),
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
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture1.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_mtl1.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_png1.png"),
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
          source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture2.obj")}
          resources={[
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_mtl2.mtl"),
            require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_png2.png"),
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
              source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture1.obj")}
              resources={[
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_mtl1.mtl"),
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_png1.png"),
              ]}
              position={[0.18, 0, -1]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, 100, 0]}
              type="OBJ"
              onClick={onClickTransformModal}
              onLoadEnd={onLoadModel}
              animation={{
                name: "moveLoop",
                run: true,
                loop: true,
                onFinish: plate1AnimationEnd,
              }}
            />

            <Viro3DObject
              source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture2.obj")}
              resources={[
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_mtl2.mtl"),
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_png2.png"),
              ]}
              position={[-0.18, 0, -1]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, 100, 0]}
              type="OBJ"
              onClick = {onClickTransformModal}
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
              source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture1.obj")}
              resources={[
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_mtl1.mtl"),
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_png1.png"),
              ]}
              position={[0.18, 0, -1]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, 100, 0]}
              type="OBJ"
              onClick={onClickDivergentModal}
              onLoadEnd={onLoadModel}
              animation={{
                name: "moveLoop3",
                run: true,
                loop: true,
                onFinish: plate1AnimationEnd,
              }}
            />

            <Viro3DObject
              source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture2.obj")}
              resources={[
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_mtl2.mtl"),
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_png2.png"),
              ]}
              position={[-0.18, 0, -1]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, 100, 0]}
              type="OBJ"
              onClick={onClickDivergentModal}
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
              source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture1.obj")}
              resources={[
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_mtl1.mtl"),
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065716_texture_obj1/Coastal_Cross_Section_1208065716_texture_png1.png"),
              ]}
              position={[0.28, 0.1, -1]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, 0, -10]}
              type="OBJ"
              onClick={onClickConvergentModal}
              onLoadEnd={onLoadModel}
              animation={{
                name: "moveLoop6",
                run: true,
                loop: true,
                onFinish: plate1AnimationEnd,
              }}
            />

            <Viro3DObject
              source={require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture2.obj")}
              resources={[
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_mtl2.mtl"),
                require("@/assets/3d-models/test/Coastal_Cross_Section_1208065723_texture_obj2/Coastal_Cross_Section_1208065723_texture_png2.png"),
              ]}
              position={[-0.28, 0.1, -1]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, 0, -10]}
              onClick={onClickConvergentModal}
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
            require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture_mtl.mtl"),
            require("@/assets/3d-models/test/Subduction_Zone_Diagr_1208071209_texture_obj/Subduction_Zone_Diagr_1208071209_texture_png.png"),
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
          onClick={onClickModal}
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
          <Modal isVisible={transformModalVisible}
          style={{justifyContent: 'flex-end', marginBottom: 180}}
          animationIn={'tada'}
          onBackdropPress={() => setTransformModalVisible(false)}
          backdropOpacity={0}>
            <View style={styles.labelModalContainer}>
              <Text style={styles.headerText}>Did you know?</Text>
              <Text style={styles.questionText}>Plates slide horizontally past each other, causing earthquakes without creating or destroying crust. The movement is mostly lateral, with no volcanic activity.</Text>
            </View>
          </Modal>
          <Modal isVisible={convergentModalVisible}
          style={{justifyContent: 'flex-end', marginBottom: 180}}
          animationIn={'tada'}
          onBackdropPress={() => setConvergentModalVisible(false)}
          backdropOpacity={0}>
            <View style={styles.labelModalContainer}>
              <Text style={styles.headerText}>Did you know?</Text>
              <Text style={styles.questionText}>Plates collide, leading to subduction, mountain formation, or volcanic arcs. The denser plate may be forced down into the mantle, causing trenches.</Text>
            </View>
          </Modal>
          <Modal isVisible={divergentModalVisible}
          style={{justifyContent: 'flex-end', marginBottom: 180}}
          animationIn={'tada'}
          onBackdropPress={() => setDivergentModalVisible(false)}
          backdropOpacity={0}>
            <View style={styles.labelModalContainer}>
              <Text style={styles.headerText}>Did you know?</Text>
              <Text style={styles.questionText}>Plates move apart, creating new crust as magma rises to fill the gap. This often forms mid-ocean ridges or rift valleys and can cause volcanic activity.</Text>
            </View>
          </Modal>
        <GeoButton style={{position: 'absolute', bottom: '20%', right: '5%'}} onPress={toggleSound}>
              <Ionicons
                name={
                isPlaying ? "volume-high-outline" : "volume-mute-outline"
                }
                style={styles.rotateButton}
              />
            </GeoButton>
        <View style={styles.controlVIew}>
          <View>
            <Text style={styles.titleStyle}>{object} Boundaries</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <GeoButton
              style={styles.buttonStyle}
              onPress={() => {setObject("convergent"); stopSound();}}
            >
              <Text style={{ color: "#ffffff", fontFamily: "Roboto_300Light" }}>
                Convergent
              </Text>
            </GeoButton>
            <GeoButton
              style={styles.buttonStyle}
              onPress={() => {setObject("divergent"); stopSound();}}
            >
              <Text style={{ color: "#ffffff", fontFamily: "Roboto_300Light" }}>
                Divergent
              </Text>
            </GeoButton>
            <GeoButton
              style={styles.buttonStyle}
              onPress={() => {setObject("transform"); stopSound();}}
            >
              <Text style={{ color: "#ffffff", fontFamily: "Roboto_300Light" }}>
                Transform
              </Text>
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
          style={{ flex: 1 }}
          viroAppProps={{
            object: object,
            rotate: rotate,
            rotationDirection: rotationDirection,
          }}
        />
        <Modal 
        isVisible={isModalVisible}
        style={{justifyContent: 'flex-end', marginBottom: 180}}
        animationIn={'tada'}
        onBackdropPress={() => setIsModalVisible(false)}
        backdropOpacity={0}>
          <View style={styles.labelModalContainer}>
            <Text style={styles.headerText}>Did you know?</Text>
            <Text style={styles.questionText}>
              Earth's tectonic plates float on molten rock, moving as fast as
              your nails grow! This slow movement creates mountains, volcanoes,
              and earthquakes.
            </Text>
          </View>
        </Modal>
        <Modal isVisible={innerModalVisible}
        style={{justifyContent: 'flex-end', marginBottom: 180}}
        animationIn={'tada'}
        onBackdropPress={() => setInnerModalVisible(false)}
        backdropOpacity={0}>
          <View style={styles.labelModalContainer}>
            <Text style={styles.headerText}>Did you know?</Text>
            <Text style={styles.questionText}>The Earth’s innermost layer, a dense, solid sphere composed primarily of iron and nickel, subjected to immense heat and pressure.</Text>
          </View>
        </Modal>
        <Modal 
        isVisible={outerModalVisible}
        style={{justifyContent: 'flex-end', marginBottom: 180}}
        animationIn={'tada'}
        onBackdropPress={() => setOuterModalVisible(false)}
        backdropOpacity={0}>
          <View style={styles.labelModalContainer}>
            <Text style={styles.headerText}>Did you know?</Text>
            <Text style={styles.questionText}>A hot, liquid layer of molten iron and nickel that surrounds the inner core and generates Earth’s magnetic field.</Text>
          </View>
        </Modal>
        <Modal 
        isVisible={mantleModalVisible}
        style={{justifyContent: 'flex-end', marginBottom: 180}}
        animationIn={'tada'}
        onBackdropPress={() => setMantleModalVisible(false)}
        backdropOpacity={0}>
          <View style={styles.labelModalContainer}>
            <Text style={styles.headerText}>Did you know?</Text>
            <Text style={styles.questionText}>The thickest layer beneath the crust, made of semi-solid silicate rocks, where convection currents cause the movement of tectonic plates.</Text>
          </View>
        </Modal>
        <Modal 
        isVisible={crustModalVisible}
        style={{justifyContent: 'flex-end', marginBottom: 180}}
        animationIn={'tada'}
        onBackdropPress={() => setCrustModalVisible(false)}
        backdropOpacity={0}
        >
          <View style={styles.labelModalContainer}>
            <Text style={styles.headerText}>Did you know?</Text>
            <Text style={styles.questionText}>The Earth’s outermost and thinnest layer, composed of solid rocks and minerals, forms the continents and ocean floors, supporting all life.</Text>
          </View>
        </Modal>
        <GeoButton style={{position: 'absolute', bottom: '20%', right: '5%'}} onPress={toggleSound}>
              <Ionicons
                name={
                isPlaying ? "volume-high-outline" : "volume-mute-outline"
                }
                style={styles.rotateButton}
              />
            </GeoButton>
        <View style={styles.controlVIew}>
          <View>
            <Text style={styles.titleStyle}>{title}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GeoButton onPress={() => rotateEarthStructure("rotateLeft")}>
              <Ionicons
                name="chevron-back-outline"
                style={styles.rotateButton}
              />
            </GeoButton>
            <Text style={styles.rotateTextStyle}>Tap to Rotate the Model!</Text>
            <GeoButton onPress={() => rotateEarthStructure("rotateRight")}>
              <Ionicons
                name="chevron-forward-outline"
                style={styles.rotateButton}
              />
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
        <Modal 
        isVisible={isModalVisible}
        style={{justifyContent: 'flex-end', marginBottom: 180}}
        animationIn={'tada'}
        onBackdropPress={() => setIsModalVisible(false)}
        backdropOpacity={0}>
          <View style={styles.labelModalContainer}>
            <Text style={styles.headerText}>Did you know?</Text>
            <Text style={styles.questionText}>
              Volcanoes form when magma escapes Earth's crust, while valleys are
              carved by rivers over time. These Processes shape the land around
              us!
            </Text>
          </View>
        </Modal>
        <GeoButton style={{position: 'absolute', bottom: '20%', right: '5%'}} onPress={toggleSound}>
              <Ionicons
                name={
                isPlaying ? "volume-high-outline" : "volume-mute-outline"
                }
                style={styles.rotateButton}
              />
            </GeoButton>
        <View style={styles.controlVIew}>
          <View>
            <Text style={styles.titleStyle}>{title}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GeoButton onPress={() => rotateEarthStructure("rotateLeft")}>
              <Ionicons
                name="chevron-back-outline"
                style={styles.rotateButton}
              />
            </GeoButton>
            <Text style={styles.rotateTextStyle}>Tap to Rotate the Model!</Text>
            <GeoButton onPress={() => rotateEarthStructure("rotateRight")}>
              <Ionicons
                name="chevron-forward-outline"
                style={styles.rotateButton}
              />
            </GeoButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Roboto_900Black",
    alignSelf: "center",
  },
  backIcon: {
    fontSize: 25,
    color: "#000000",
    alignSelf: "baseline",
  },
  learnButton: {
    backgroundColor: "#008000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    height: 40,
    width: 160,
    alignSelf: "center",
  },
  questionText: {
    fontSize: 15,
    marginTop: 10,
    color: "#333",
    fontFamily: "Roboto_400Regular",
  },
  labelModalContainer: {
    alignSelf: "flex-end",
    width: '100%',
    height: '25%',
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
  },
  modalContainer: {
    alignSelf: "center",
    position: "absolute",
    width: 300,
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
  },
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
    margin: 10,
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
