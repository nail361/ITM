import * as React from "react";
import { TextInput } from "react-native-paper";

const CustomTextInput = (props) => (
  <TextInput {...props} style={props.style || null} mode="flat" />
);

export default CustomTextInput;
