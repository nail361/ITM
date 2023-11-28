import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";

import { Colors } from "../../utils/colors";
import { searchUsers } from "../../utils/db";
import CustomAvatar from "../ui/avatar";
import CustomTextInput from "../ui/textInput";

function UserList(props) {
  const { uid, photo, about, onUserSelect } = props;

  return (
    <Pressable onPress={() => onUserSelect(uid)}>
      <View style={styles.videoList}>
        <CustomAvatar size={25} photo={photo} />
        <Text style={styles.about} numberOfLines={1} ellipsizeMode="tail">
          {about}
        </Text>
      </View>
    </Pressable>
  );
}

let timer = null;

export default function Search() {
  const myUid = useSelector((state) => state.auth.uid);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const navigation = useNavigation();

  async function fetchUsers(searchText) {
    setLoading(true);

    const response = await searchUsers(searchText);
    if (response.error) {
      Alert.alert(response.error);
    } else {
      setUsers(response);
    }

    setLoading(false);
  }

  function onSearchChange(text) {
    setSearchValue(text);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fetchUsers(searchValue), 1500);
  }

  function onUserSelect(uid) {
    if (uid === myUid) navigation.navigate("MyProfile");
    else navigation.navigate("UserProfile", { uid });
  }

  return (
    <View style={styles.container}>
      <FontAwesome5
        name="search"
        style={styles.searchIcon}
        size={24}
        color={Colors.bgColor}
      />
      <CustomTextInput
        onChangeText={(text) => onSearchChange(text)}
        style={styles.searchField}
        label={t("profile.search_field")}
        inputMode="text"
        value={searchValue}
      />
      <FlatList
        refreshing={loading}
        style={styles.list}
        numColumns={1}
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <UserList {...item} onUserSelect={onUserSelect} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchField: {
    paddingRight: 20,
  },
  searchIcon: {
    position: "absolute",
    top: 15,
    right: 10,
    zIndex: 1,
  },
  list: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  videoList: {
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
  about: {
    fontFamily: "ubuntu",
    fontSize: 16,
    paddingLeft: 10,
    flex: 1,
    color: Colors.headerTextColor,
  },
});
