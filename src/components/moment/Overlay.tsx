import { Entypo } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";

type CameraOverlayType = {
  video: any;
  isRecording: boolean;
  onPress: any;
};

function CameraOverlay(props: CameraOverlayType) {
  const { video, isRecording, onPress } = props;

  if (isRecording) return null;

  const mediaIsPreviewed = !!(video && video.uri);
  const iconColor = mediaIsPreviewed ? "white" : "red";

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={onPress}>
          <Entypo name="controller-record" size={24} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 2,
  },
  buttons: {
    alignItems: "center",
  },
  button: {
    padding: 15,
    paddingBottom: 15,
    shadowRadius: 10,
    shadowColor: "#ffffff60",
    shadowOpacity: 0.6,
    elevation: 10,
  },
});

export default CameraOverlay;
