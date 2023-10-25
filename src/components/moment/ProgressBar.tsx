import {
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

function ProgressBar(props: any) {
  const { animationStyle, isRecording, video, cancelMedia } = props;
  const videoIsReady = !isRecording && !!(video && video.uri);
  let { progressText } = props;
  progressText =
    !isRecording && !(video && video.uri) && !progressText
      ? "..."
      : progressText;
  if (!isRecording && !(video && video.uri)) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wrapper, animationStyle]}>
        {!videoIsReady ? (
          <View style={styles.textWrapper}>
            <Text style={styles.text}>{progressText}</Text>
          </View>
        ) : (
          <View style={styles.inner}>
            <TouchableOpacity style={styles.cancel} onPress={cancelMedia}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text>Post to story</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const padding = 20;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    zIndex: 3,
    backgroundColor: "#ffffff10",
  },
  wrapper: {
    backgroundColor: "red",
    height: padding * 2.5,
  },
  textWrapper: {
    position: "absolute",
    top: padding / 2,
    right: padding / 2,
  },
  text: {
    textAlign: "right",
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: padding / 2,
    paddingTop: padding / 2,
  },
  button: {
    padding: padding / 2,
    paddingHorizontal: padding * 0.75,
    borderRadius: padding,
    backgroundColor: "white",
  },
  cancel: {
    padding: padding / 2,
    paddingHorizontal: padding * 0.75,
    borderRadius: padding,
  },
  cancelText: {
    color: "white",
  },
});

export default ProgressBar;
