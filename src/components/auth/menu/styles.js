import { StyleSheet } from "react-native";

import { Colors } from "../../../utils/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "50%",
    padding: 20,
  },
  providerButton: {
    borderColor: "lightgray",
    borderWidth: 1,
    borderStyle: "solid",
    padding: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.bgColor,
  },
  emailText: {
    color: "white",
  },
  signUpButton: {
    height: 50,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "lightgray",
  },
  signUpBackground: {
    flex: 1,
  },
  signUpText: {
    fontFamily: "ubuntu",
    textAlign: "center",
    color: "white",
    paddingTop: 15,
  },
  boldText: {
    fontFamily: "ubuntu-bold",
    color: Colors.lightTextColor,
  },
});

export default styles;
