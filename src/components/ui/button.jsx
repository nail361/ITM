import { Button } from "react-native-paper";

export default function CustomButton(props) {
  return (
    <Button
      onPress={props.onPress}
      disabled={props.disabled || false}
      style={props.style || null}
      mode={props.mode || "contained"}
    >
      {props.children}
    </Button>
  );
}
