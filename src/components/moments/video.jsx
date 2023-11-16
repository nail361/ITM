import { StyleSheet, View, Pressable } from "react-native";
import { Colors } from "../../utils/colors";
import CustomText from "../ui/text";

function VideoList(props) {
  const { id, description, onPress } = props;

  return (
    <Pressable onPress={() => onPress(id)}>
      <View style={styles.container}>
        <CustomText>{description}</CustomText>
      </View>
    </Pressable>
  );
}

export default VideoList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.lightTextColor,
    borderRadius: 10,
  },
});
