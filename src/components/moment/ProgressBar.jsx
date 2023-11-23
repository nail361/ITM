import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";

export default function ProgressBar(props) {
  const { isRecording, maxDuration, onEndEvent } = props;
  const progress = useSharedValue(0);

  function onAnimationCallback(finished) {
    if (finished) onEndEvent();
  }

  useEffect(() => {
    progress.value = 0;

    if (isRecording) {
      progress.value = withTiming(
        1,
        {
          duration: maxDuration * 1000,
          easing: Easing.linear,
        },
        (isFinished) => {
          runOnJS(onAnimationCallback)(isFinished);
        },
      );
    } else {
      cancelAnimation(progress);
    }
  }, [isRecording]);

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${90 * (1 - progress.value)}%`,
  }));

  if (!isRecording) {
    return null;
  }

  return (
    <Animated.View style={[styles.progressBar, animatedStyles]}></Animated.View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    position: "absolute",
    height: 5,
    bottom: 15,
    zIndex: 1,
    marginHorizontal: 20,
    backgroundColor: "#ff0000",
    opacity: 0.3,
  },
});
