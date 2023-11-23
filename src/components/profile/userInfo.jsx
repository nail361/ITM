import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { useSelector } from "react-redux";

import { Colors } from "../../utils/colors";
import { getUserInfo } from "../../utils/db";
import CustomAvatar from "../ui/avatar";
import CustomButton from "../ui/button";
import Loading from "../ui/loading";
import CustomText from "../ui/text";

const MAX_FOLLOWERS = 10000000;

function Popularity(props) {
  const { likes, dislikes, followers } = props;

  const percent = 50; // придумать формулу
  const max_width = 75;
  const width = max_width * (Math.abs(percent) / 100);
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
          borderTopLeftRadius: percent < 0 ? borderRadius : 0,
          borderBottomLeftRadius: percent < 0 ? borderRadius : 0,
          borderTopRightRadius: percent > 0 ? borderRadius : 0,
          borderBottomRightRadius: percent > 0 ? borderRadius : 0,
          backgroundColor:
            percent > 0 ? Colors.popularity.p90 : Colors.popularity.m90,
          transform: [
            { scaleY: Math.sign(percent) },
            { translateX: (width / 2) * Math.sign(percent) },
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

  let name = "";

  let about = "";
  let photo = "";
  let likes = "";
  let dislikes = "";
  let followers = "";
  let following = "";

  if (profileRoute.name === "MyProfile") {
    name = useSelector((state) => state.auth.username);

    about = useSelector((state) => state.profile.about);
    photo = useSelector((state) => state.profile.photo);
    likes = useSelector((state) => state.profile.likes);
    dislikes = useSelector((state) => state.profile.dislikes);
    followers = useSelector((state) => state.profile.followers);
    following = useSelector((state) => state.profile.following);
  }

  useEffect(() => {
    if (profileRoute.name === "UserProfile") {
      fetchUserInfo();
    }
  }, []);

  async function fetchUserInfo() {
    setLoading(true);

    const response = await getUserInfo(profileRoute.params.uid);
    if (response.error) {
      Alert.alert(response.error);
    } else {
      name = response.name;

      about = response.about;
      photo = response.photo;
      likes = response.likes;
      dislikes = response.dislikes;
      followers = response.followers;
      followers = response.followers;
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomText>{name}</CustomText>
      <CustomAvatar size={80} photo={photo} />
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
          <Popularity likes={likes} dislikes={dislikes} followers={followers} />
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
});
