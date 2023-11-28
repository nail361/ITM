import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";

import CustomText from "../ui/text";

type CameraOverlayType = {
  isRecording: boolean;
  gallery: any[];
  onToggleRecord: any;
  onGalleryPress: any;
  onToggleCameraDirection: any;
  onToggleFlashlight: any;
};

let timer: any = null;
const MIN_RECORD_SEC = 5;

function CameraOverlay(props: CameraOverlayType) {
  const {
    isRecording,
    gallery,
    onToggleRecord,
    onGalleryPress,
    onToggleCameraDirection,
    onToggleFlashlight,
  } = props;

  const [counter, setCounter] = useState(MIN_RECORD_SEC);

  useEffect(() => {
    if (isRecording) {
      setCounter(MIN_RECORD_SEC);
      timer = setInterval(onTick, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  function onTick() {
    setCounter((prevCounter) => {
      const newCounter = prevCounter - 1;
      if (newCounter === 0) clearInterval(timer);
      return newCounter;
    });
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Pressable
            style={[
              styles.recordButton,
              isRecording ? styles.recording : null,
              isRecording && counter > 0 ? styles.disabled : null,
            ]}
            disabled={isRecording && counter > 0}
            onPress={onToggleRecord}
          >
            {isRecording && counter > 0 && (
              <CustomText style={styles.counter}>{counter}</CustomText>
            )}
          </Pressable>
          {gallery.length > 0 && (
            <Pressable
              style={[styles.gallery, isRecording ? styles.hidden : null]}
              onPress={onGalleryPress}
            >
              <Image
                style={styles.galleryImage}
                source={{ uri: gallery[0].uri }}
              />
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.sidebar}>
        <Pressable
          onPress={onToggleCameraDirection}
          disabled={isRecording}
          style={isRecording ? styles.transparent : null}
        >
          <Entypo name="cycle" size={36} color="white" />
        </Pressable>
        <Pressable onPress={onToggleFlashlight}>
          <Entypo name="flash" size={36} color="white" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
  },
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 30,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#ff4040",
    borderWidth: 8,
    borderColor: "#ff404080",
    justifyContent: "center",
    alignItems: "center",
  },
  counter: {
    fontSize: 30,
    color: "white",
    paddingTop: 10,
  },
  recording: {
    opacity: 0.5,
  },
  disabled: {
    backgroundColor: "#ff402030",
    borderColor: "#ff404030",
  },
  transparent: {
    opacity: 0.5,
  },
  gallery: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    width: 50,
    height: 50,
    position: "absolute",
    right: -100,
    top: 20,
  },
  galleryImage: {
    width: 50,
    height: 50,
  },
  hidden: {
    display: "none",
  },
  sidebar: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 110,
    top: 60,
    right: 20,
    position: "absolute",
    opacity: 0.8,
  },
});

export default CameraOverlay;
