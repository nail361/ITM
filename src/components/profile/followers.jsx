import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import UserFollowerList from "./userFollowerList";
import { profileActions } from "../../store/profile";
import { getFollowers, getUsersInfo } from "../../utils/db";

// Подписчики
export default function Followers() {
  const { profileRoute } = useRoute().params;
  const followingUids = useSelector((state) => state.profile.following);
  let followersUids = [];
  if (profileRoute.name === "MyProfile")
    followersUids = useSelector((state) => state.profile.followers);

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
        title: `Подписчики ${profileRoute.params.uid}`,
      });
    }

    fetchFollowers();
  }, []);

  async function fetchFollowers() {
    setLoading(true);

    if (profileRoute.name === "UserProfile") {
      followersUids = await getFollowers(profileRoute.params.uid);

      if (followersUids.error) {
        Alert.alert(followersUids.error);
        setLoading(false);
        return;
      }
    }

    const response = await getUsersInfo(followersUids);

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

  function onFollowerRemoveConfirm(uid) {
    Alert.alert(
      "Remove follower",
      "Are you sure to remove user from your followers?",
      [
        {
          text: "Cancel",
        },
        { text: "OK", onPress: () => onRemoveFollower(uid) },
      ],
    );
  }

  function onRemoveFollower(uid) {
    console.log(`remove follower ${uid}`);
    const newFollowers = followersUids.filter((id) => id !== uid);
    //запрос к серверу
    dispatch(profileActions.updateFollowers(newFollowers));
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
          onRemoveHandler={onFollowerRemoveConfirm}
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
