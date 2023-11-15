import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    width: "100%",
    height: "50%",
    marginTop: 10,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: "#ffffff50",
    borderColor: "black",
  },
  radiusSlider: {
    width: "90%",
    height: 50,
  },
});

export default styles;
