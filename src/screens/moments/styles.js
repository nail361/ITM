import { StyleSheet } from "react-native";

import { Colors } from "../../utils/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bgColor,
    alignItems: "center",
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
    zIndex: 1,
    backgroundColor: "#454d6670",
    paddingLeft: 5,
    borderRadius: 5,
  },
  switcherText: {
    color: "white",
  },
  mapContainer: {
    width: "100%",
    height: "50%",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default styles;
