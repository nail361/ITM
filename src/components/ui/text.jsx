import * as React from "react";
import { Text } from "react-native-paper";

const CustomText = (props) => (
  <Text
    variant={props.variant ? props.variant : "titleMedium"}
    style={props.style || null}
  >
    {props.children}
  </Text>
);

export default CustomText;
