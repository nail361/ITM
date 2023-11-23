import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import UserFollowerList from "./userFollowerList";
import { profileActions } from "../../store/profile";
import { getUsersInfo, getFollowing } from "../../utils/db";

// Подписки
export default function Following() {
  const { profileRoute } = useRoute().params;

  let followingUids = [];

  if (profileRoute.name === "MyProfile")
    followingUids = useSelector((state) => state.profile.following);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (profileRoute.name === "UserProfile") {
      // navigation.getParent().setOptions({
      //   headerShown: false,
      // });
      navigation.setOptions({
        title: `Подписки ${profileRoute.params.uid}`,
      });
    }

    fetchFollowing();
  }, []);

  async function fetchFollowing() {
    setLoading(true);

    if (profileRoute.name === "UserProfile") {
      followingUids = await getFollowing(profileRoute.params.uid);

      if (followingUids.error) {
        Alert.alert(followingUids.error);
        setLoading(false);
        return;
      }
    }

    const response = await getUsersInfo(followingUids);

    if (response.error) {
      Alert.alert(response.error);
    } else {
      setUsers(response);
    }

    setLoading(false);
  }

  function onUserSelect(uid) {
    if (profileRoute.name === "MyProfile")
      navigation.navigate("UserProfile", { uid });
    else navigation.replace("UserProfile", { uid });
  }

  function onUnsubscribeConfirm(uid) {
    Alert.alert("Unsubscribe", "Are you sure to unsubscribe?", [
      {
        text: "Cancel",
      },
      { text: "OK", onPress: () => onUnsubscribe(uid) },
    ]);
  }

  function onUnsubscribe(uid) {
    const newFollowing = followingUids.filter((id) => id !== uid);
    dispatch(profileActions.updateFollowing(newFollowing));
    const newUsers = users.filter((user) => user.uid !== uid);
    setUsers(newUsers);
  }

  function onSubscribe(uid) {
    console.log(`subscribe ${uid}`);
    //await server
    dispatch(profileActions.updateFollowing([...followingUids, uid]));
  }

  return (
    <FlatList
      refreshing={loading}
      style={styles.list}
      numColumns={1}
      data={users}
      keyExtractor={(item) => item.uid}
      renderItem={({ item }) => (
        <UserFollowerList
          {...item}
          followings={followingUids}
          onUserSelect={onUserSelect}
          onRemoveHandler={onUnsubscribeConfirm}
          onSubscribe={onSubscribe}
          showRemove={profileRoute.name === "MyProfile"}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 10,
  },
});
