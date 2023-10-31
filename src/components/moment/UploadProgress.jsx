import { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue,
  Easing,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "../../utils/colors";

const { width, height } = Dimensions.get("window");
const CIRCLE_LENGTH = 1000;
const CIRCLE_RARIUS = CIRCLE_LENGTH / (2 * Math.PI);

export default function UploadProgress(props) {
  const { progress } = props;
  const animatedPercent = useSharedValue(0);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  useEffect(() => {
    animatedPercent.value = withTiming(progress, {
      duration: 300,
      easing: Easing.linear,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - animatedPercent.value / 100),
  }));

  const progressText = useDerivedValue(() => {
    return `${Math.floor(animatedPercent.value)}%`;
  });

  return (
    <View style={styles.container}>
      <Svg>
        <Circle
          style={styles.circle}
          cx={width / 2}
          cy={height / 2 - CIRCLE_RARIUS / 2}
          r={CIRCLE_RARIUS}
          stroke={Colors.secondColor}
          fillOpacity={0}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2 - CIRCLE_RARIUS / 2}
          r={CIRCLE_RARIUS}
          stroke={Colors.mainTextColor}
          strokeWidth={15}
          fillOpacity={0}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={"round"}
        />
      </Svg>
      <ReText style={styles.text} text={progressText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  text: {
    fontFamily: "ubuntu-bold",
    color: Colors.mainTextColor,
    position: "absolute",
    fontSize: 80,
    textAlign: "center",
    top: height / 3,
  },
});
