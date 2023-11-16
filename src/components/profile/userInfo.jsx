import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar } from "react-native-paper";

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
  const { user } = props;

  return (
    <View style={styles.container}>
      <CustomText>{user.name}</CustomText>
      <Avatar.Icon size={80} icon={"account"} />
      <CustomText style={styles.emailText}>{user.email}</CustomText>
      <View style={styles.statistic}>
        <View style={styles.counterContainer}>
          <CustomText style={styles.counter}>0</CustomText>
          <CustomText style={styles.counterText}>Following</CustomText>
        </View>
        <View style={styles.counterContainer}>
          <CustomText>Popularity</CustomText>
          <Popularity />
        </View>
        <View style={styles.counterContainer}>
          <CustomText style={styles.counter}>0</CustomText>
          <CustomText style={styles.counterText}>Followers</CustomText>
        </View>
      </View>
      <CustomButton style={styles.editBtn} mode={"outlined"}>
        Edit Profile
      </CustomButton>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    alignItems: "center",
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
