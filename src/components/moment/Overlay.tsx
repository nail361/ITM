import { Image } from "expo-image";
import { View, StyleSheet, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

type CameraOverlayType = {
  isRecording: boolean;
  gallery: any[];
  onToggleRecord: any;
  onGalleryPress: any;
  onToggleCameraDirection: any;
  onToggleFlashlight: any;
};

function CameraOverlay(props: CameraOverlayType) {
  const {
    isRecording,
    gallery,
    onToggleRecord,
    onGalleryPress,
    onToggleCameraDirection,
    onToggleFlashlight,
  } = props;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Pressable
            style={[styles.button, isRecording ? styles.recording : null]}
            onPress={onToggleRecord}
          ></Pressable>
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
        <Pressable onPress={onToggleCameraDirection}>
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
  button: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#ff4040",
    borderWidth: 8,
    borderColor: "#ff404080",
  },
  recording: {
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
    top: 40,
    right: 20,
    position: "absolute",
    opacity: 0.8,
  },
});

export default CameraOverlay;
