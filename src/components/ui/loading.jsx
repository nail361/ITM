import { StyleSheet, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { Colors } from "../../utils/colors";

export default function Loading(props) {
  return (
    <View style={[styles.loading, props.style || null]}>
      <ActivityIndicator
        size="large"
        animating={true}
        color={Colors.mainColor}
      />
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
    backgroundColor: "white",
  },
});
