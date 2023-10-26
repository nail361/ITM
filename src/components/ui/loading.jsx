import { StyleSheet, View, Text } from "react-native";
import { Colors } from "../../utils/colors";

export default function Loading(props) {
  return (
    <View style={styles.loading}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    height: "100%",
    width: "100%",
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: Colors.mainColor,
  },
  text: {
    fontFamily: "ubuntu",
    fontSize: 34,
    textAlign: "center",
    color: Colors.headerTextColor,
  },
});
