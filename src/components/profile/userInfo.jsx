import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

import { Colors } from "../../utils/colors";
import CustomButton from "../ui/button";
import CustomText from "../ui/text";

function Popularity(props) {
  const percent = 50;
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
  const name = useSelector((state) => state.auth.username);
  const email = useSelector((state) => state.auth.email);

  const about = useSelector((state) => state.profile.about);
  const photo = useSelector((state) => state.profile.photo);
  const followers = useSelector((state) => state.profile.followers);
  const following = useSelector((state) => state.profile.following);

  const navigation = useNavigation();

  function onEditProfile() {
    navigation.push("editProfile");
  }

  function onFollowingPress() {
    navigation.push("following");
  }

  function onFollowersPress() {
    navigation.push("followers");
  }

  return (
    <View style={styles.container}>
      <CustomText>{name}</CustomText>
      {photo ? (
        <Avatar.Image size={80} source={{ uri: photo }} />
      ) : (
        <Avatar.Icon size={80} icon={"account"} />
      )}
      <CustomText style={styles.emailText}>{email}</CustomText>
      <CustomText style={styles.aboutText}>{about}</CustomText>
      <View style={styles.statistic}>
        <Pressable style={styles.counterContainer} onPress={onFollowingPress}>
          <CustomText style={styles.counter}>{following.length}</CustomText>
          <CustomText style={styles.counterText}>Following</CustomText>
        </Pressable>
        <View style={styles.counterContainer}>
          <CustomText>Popularity</CustomText>
          <Popularity />
        </View>
        <Pressable style={styles.counterContainer} onPress={onFollowersPress}>
          <CustomText style={styles.counter}>{followers.length}</CustomText>
          <CustomText style={styles.counterText}>Followers</CustomText>
        </Pressable>
      </View>
      <CustomButton
        style={styles.editBtn}
        mode={"outlined"}
        onPress={onEditProfile}
      >
        Edit Profile
      </CustomButton>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  aboutText: {
    marginVertical: 10,
  },
  emailText: {
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
    width: "95%",
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
});
