import { StyleSheet, View, Text, Pressable } from "react-native";

import { Colors } from "../../utils/colors";
import CustomAvatar from "../ui/avatar";
import CustomText from "../ui/text";

function VideoList(props) {
  const { id, photo, description, createdAt, selected, onPress } = props;

  const time = new Date(createdAt).toLocaleTimeString();

  return (
    <Pressable onPress={() => onPress(id)}>
      <View style={[styles.container, selected ? styles.selected : null]}>
        <CustomAvatar size={25} photo={photo} />
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {description}
        </Text>
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
    marginTop: 3,
  },
  selected: {
    borderColor: "green",
    borderWidth: 2,
  },
  description: {
    fontFamily: "ubuntu",
    fontSize: 16,
    paddingHorizontal: 10,
    flex: 1,
    color: Colors.headerTextColor,
  },
  time: {
    color: Colors.headerTextColor,
  },
});
