import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { useSelector } from "react-redux";

import { Colors } from "../../utils/colors";
import { getUserInfo, publishAvatar } from "../../utils/db";
import { calculatePopularity } from "../../utils/utils";
import CustomAvatar from "../ui/avatar";
import CustomButton from "../ui/button";
import Loading from "../ui/loading";
import CustomText from "../ui/text";

function Popularity(props) {
  const { popularity } = props;

  const max_width = 75;
  const width = max_width * (Math.abs(popularity) / 100);
  const borderRadius = 10;

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius,
        width: 150,
        borderColor: "lightgrey",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: 5,
      }}
    >
      <View
        style={{
          width,
          height: 15,
          borderTopLeftRadius: popularity < 0 ? borderRadius : 0,
          borderBottomLeftRadius: popularity < 0 ? borderRadius : 0,
          borderTopRightRadius: popularity > 0 ? borderRadius : 0,
          borderBottomRightRadius: popularity > 0 ? borderRadius : 0,
          backgroundColor:
            popularity > 0 ? Colors.popularity.p90 : Colors.popularity.m90,
          transform: [
            { scaleY: Math.sign(popularity) },
            { translateX: (width / 2) * Math.sign(popularity) },
          ],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 1.5,
          height: 25,
          backgroundColor: "grey",
        }}
      />
    </View>
  );
}

export default function UserInfo(props) {
  const { t } = useTranslation();

  const { profileRoute } = useRoute().params;
  const [loading, setLoading] = useState(false);

  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const popularity = calculatePopularity(likes, dislikes, followers.length);

  let _name = "";
  let profileState = {};

  if (profileRoute.name === "MyProfile") {
    profileState = useSelector((state) => state.profile);
    _name = useSelector((state) => state.auth.username);
  }

  useEffect(() => {
    if (profileRoute.name === "MyProfile") {
      fetchMyInfo();
    }
  }, [profileState]);

  useEffect(() => {
    if (profileRoute.name === "UserProfile") {
      fetchUserInfo();
    }
  }, []);

  function fetchMyInfo() {
    setName(_name);
    setPhoto(profileState.photo);
    setAbout(profileState.about);
    setLikes(profileState.likes);
    setDislikes(profileState.dislikes);
    setFollowers(profileState.followers);
    setFollowing(profileState.following);
  }

  async function fetchUserInfo() {
    setLoading(true);

    const response = await getUserInfo(profileRoute.params.uid);
    if (response.error) {
      Alert.alert(response.error);
    } else {
      setName(response.name);

      setAbout(response.about);
      // photo = response.photo;
      setLikes(response.likes);
      setDislikes(response.dislikes);
      setFollowers(response.followers);
      setFollowing(response.followers);
    }

    setLoading(false);
  }

  const navigation = useNavigation();

  function onEditProfile() {
    navigation.navigate("editProfile");
  }

  function onFollowingPress() {
    navigation.navigate("following");
  }

  function onFollowersPress() {
    navigation.navigate("followers");
  }

  function onSearch() {
    navigation.navigate("search");
  }

  async function onChooseAvatar() {
    const galleryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (galleryStatus.status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        uploadUserAvatar(result.assets[0].uri);
      }
    }
  }

  function uploadUserAvatar(uri) {
    setLoading(true);
    fetch(uri)
      .then((response) => response.blob())
      .then(async (blob) => {
        const response = await publishAvatar(blob);
        if (response.error) {
          Alert.alert(response.error);
        } else {
          setPhoto(response);
        }
        setLoading(false);
      });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profileRoute.name === "MyProfile" && (
        <Pressable style={styles.search} onPress={onSearch}>
          <FontAwesome5 name="search" size={22} color={Colors.mainColor} />
        </Pressable>
      )}
      <CustomText>{name}</CustomText>
      <View>
        <CustomAvatar size={80} photo={photo} />
        {profileRoute.name === "MyProfile" && (
          <Pressable style={styles.avatarBtn} onPress={onChooseAvatar}>
            <Entypo
              name="circle-with-plus"
              size={24}
              color={Colors.secondColor}
            />
          </Pressable>
        )}
      </View>
      <CustomText style={styles.aboutText}>{about}</CustomText>
      <View style={styles.statistic}>
        <Pressable style={styles.counterContainer} onPress={onFollowingPress}>
          <CustomText style={styles.counter}>{following.length}</CustomText>
          <CustomText style={styles.counterText}>
            {t("profile.following")}
          </CustomText>
        </Pressable>
        <View style={styles.counterContainer}>
          <CustomText>{t("profile.popularity")}</CustomText>
          <Popularity popularity={popularity} />
        </View>
        <Pressable style={styles.counterContainer} onPress={onFollowersPress}>
          <CustomText style={styles.counter}>{followers.length}</CustomText>
          <CustomText style={styles.counterText}>
            {t("profile.followers")}
          </CustomText>
        </Pressable>
      </View>
      {profileRoute.name === "MyProfile" && (
        <CustomButton
          style={styles.editBtn}
          mode={"outlined"}
          onPress={onEditProfile}
        >
          {t("profile.edit_profile_btn")}
        </CustomButton>
      )}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  aboutText: {
    marginVertical: 10,
  },
  statistic: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    marginTop: 10,
    height: 50,
  },
  counterContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  counter: {
    fontFamily: "ubuntu-bold",
  },
  counterText: {
    color: "grey",
    fontSize: 12,
  },
  editBtn: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 20,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  search: {
    position: "absolute",
    top: 5,
    right: 10,
  },
  avatarBtn: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 50,
    right: 0,
    bottom: 0,
  },
});
