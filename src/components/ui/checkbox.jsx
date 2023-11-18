import { Checkbox } from "react-native-paper";

function CustomCheckbox(props) {
  return (
    <Checkbox
      status={props.checked ? "checked" : "unchecked"}
      onPress={() => props.onPress()}
    />
  );
}

export default CustomCheckbox;
