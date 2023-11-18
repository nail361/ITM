import { StyleSheet } from "react-native";

import { Colors } from "../../utils/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bgColor,
    alignItems: "center",
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
  locationSwitch: {
    marginTop: 10,
    width: "80%",
  },
  videoList: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
  sorting: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
  },
  sortingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  sortingText: {
    color: "white",
    fontSize: 16,
  },
  sortingDirection: {
    paddingTop: 4,
  },
  switcherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 10,
    top: 50,
    zIndex: 1,
  },
  switcherText: {
    color: Colors.headerTextColor,
  },
});

export default styles;
