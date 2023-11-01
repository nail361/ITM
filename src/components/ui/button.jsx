import { StyleSheet, Pressable, Text } from "react-native";
import { Colors } from "../../utils/colors";

export default function CustomButton(props) {
  return (
    <Pressable
      android_ripple={{ color: Colors.lightTextColor, foreground: true }}
      onPress={props.onPress}
      style={[
        styles.button,
        props.style || null,
        props.disabled ? styles.disabled : null,
      ]}
    >
      <Text style={styles.text}>{props.children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    padding: 10,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: Colors.headerTextColor,
  },
  disabled: {
    pointerEvents: "none",
    backgroundColor: Colors.lightTextColor,
  },
  text: {
    color: "white",
  },
});
