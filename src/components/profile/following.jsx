import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../store/profile";
import Loading from "../ui/loading";
import { getUsersInfo } from "../../utils/db";
import UserFollowerList from "./userFollowerList";

// Подписки
export default function Following() {
  const followingUids = useSelector((state) => state.profile.following);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchFollowing();
  }, []);

  async function fetchFollowing() {
    setLoading(true);
    const response = await getUsersInfo(followingUids);

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
          onUserSelect={onUserSelect}
          onRemoveHandler={onUnsubscribeConfirm}
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
