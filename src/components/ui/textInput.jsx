import { TextInput, HelperText } from "react-native-paper";
import { Colors } from "../../utils/colors";

const CustomTextInput = (props) => (
  <>
    <TextInput
      {...props}
      style={[props.style || null, { backgroundColor: Colors.secondColor }]}
      mode="flat"
      textColor={"white"}
      selectionColor={Colors.lightTextColor}
      activeUnderlineColor={Colors.lightTextColor}
      underlineColor={Colors.lightTextColor}
      cursorColor={Colors.lightTextColor}
    />
    <HelperText
      type={props.helperType || "error"}
      visible={props.helperVisible}
    >
      {props.helperText}
    </HelperText>
  </>
);

export default CustomTextInput;
