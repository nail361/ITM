import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../store/profile";
import Loading from "../ui/loading";
import { getUsersInfo } from "../../utils/db";
import UserFollowerList from "./userFollowerList";

// Подписчики
export default function Followers() {
  const followersUids = useSelector((state) => state.profile.followers);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchFollowers();
  }, []);

  async function fetchFollowers() {
    setLoading(true);
    const response = await getUsersInfo(followersUids);

    if (response.error) {
      Alert.alert(response.error);
    } else {
      setUsers(response);
    }

    setLoading(false);
  }

  function onUserSelect(uid) {
    console.log(uid);
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
    dispatch(profileActions.updateFollowers([...followersUids, uid]));
  }

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Loading />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      numColumns={1}
      data={users}
      keyExtractor={(item) => item.uid}
      renderItem={({ item }) => (
        <UserFollowerList
          {...item}
          followers={followersUids}
          onUserSelect={onUserSelect}
          onRemoveHandler={onFollowerRemoveConfirm}
          onSubscribe={onSubscribe}
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
