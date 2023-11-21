import { useCallback } from "react";
import { Entypo } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";

import { Colors } from "../../utils/colors";
import CustomAvatar from "../ui/avatar";
import CustomText from "../ui/text";

export default function UserFolowerList(props) {
  const {
    followers,
    uid,
    photo,
    name,
    onUserSelect,
    onRemoveHandler,
    onSubscribe,
  } = props;

  const isUserFollower = useCallback(() => {
    if (followers == null) return false;
    return followers.includes(uid);
  }, [followers, uid]);

  return (
    <Pressable style={styles.user} onPress={() => onUserSelect(uid)}>
      <View style={styles.userInfo}>
        <CustomAvatar size={30} photo={photo} />
        <CustomText style={styles.nameText}>{name}</CustomText>
      </View>
      {onSubscribe && !isUserFollower() && (
        <Pressable style={styles.subscribe} onPress={() => onSubscribe(uid)}>
          <CustomText style={styles.subscribeText}>Подписаться</CustomText>
          <Entypo name="add-to-list" size={20} color="white" />
        </Pressable>
      )}
      <Pressable style={styles.trash} onPress={() => onRemoveHandler(uid)}>
        <Entypo name="trash" size={20} color={Colors.bgColor} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  user: {
    height: 35,
    width: "100%",
    backgroundColor: "#cccccc40",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
    padding: 5,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  nameText: {
    marginLeft: 10,
    color: Colors.headerTextColor,
  },
  subscribe: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  subscribeText: {
    color: "white",
    fontSize: 10,
    marginRight: 5,
  },
  trash: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});
