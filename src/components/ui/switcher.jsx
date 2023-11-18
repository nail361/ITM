import { Switch } from "react-native-paper";

function CustomSwitcher(props) {
  return <Switch value={props.value} onValueChange={props.onToggle} />;
}

export default CustomSwitcher;
