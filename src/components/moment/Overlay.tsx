import { Image } from "expo-image";
import { View, StyleSheet, Pressable } from "react-native";

type CameraOverlayType = {
  video: any;
  isRecording: boolean;
  gallery: any[];
  onToggleRecord: any;
  onGalleryPress: any;
};

function CameraOverlay(props: CameraOverlayType) {
  const { video, isRecording, gallery, onToggleRecord, onGalleryPress } = props;

  return (
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
});

export default CameraOverlay;
