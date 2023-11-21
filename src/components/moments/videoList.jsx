import { StyleSheet, View, Pressable } from "react-native";
import { Colors } from "../../utils/colors";
import CustomText from "../ui/text";
import CustomAvatar from "../ui/avatar";

function VideoList(props) {
  const { id, photo, description, createdAt, selected, onPress } = props;

  const time = new Date(createdAt).toLocaleTimeString();

  const preparedDescription = description;

  return (
    <Pressable onPress={() => onPress(id)}>
      <View style={[styles.container, selected ? styles.selected : null]}>
        <CustomAvatar size={25} photo={photo} />
        <CustomText style={styles.description}>
          {preparedDescription}
        </CustomText>
        <CustomText style={styles.time}>{time}</CustomText>
      </View>
    </Pressable>
  );
}

export default VideoList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    backgroundColor: Colors.lightTextColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.bgColor,
    padding: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 3,
  },
  selected: {
    borderColor: "green",
    borderWidth: 2,
  },
  description: {
    marginLeft: 10,
    color: Colors.headerTextColor,
  },
  time: {
    color: Colors.headerTextColor,
  },
});
