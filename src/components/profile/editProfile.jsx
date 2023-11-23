import { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../store/auth";
import { profileActions } from "../../store/profile";
import { logoutUser, saveMyInfo } from "../../utils/db";
import CustomButton from "../ui/button";
import Loading from "../ui/loading";
import CustomText from "../ui/text";
import CustomTextInput from "../ui/textInput";

const MAX_ABOUT_SYMBOLS = 100;

export default function EditProfile() {
  const [about, setAbout] = useState(
    useSelector((state) => state.profile.about),
  );
  const [aboutError, setAboutError] = useState(false);
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  function onAboutChange(aboutText) {
    if (aboutText.length > MAX_ABOUT_SYMBOLS) {
      setAboutError(true);
    } else {
      setAboutError(false);
      setAbout(aboutText);
    }
  }

  async function saveChanges() {
    setLoader(true);

    const response = await saveMyInfo();

    if (response.error) {
      Alert.alert(response.error);
    } else {
      // dispatch(profileActions.updateInfo(response));
    }

    setLoader(false);
  }

  async function onLogout() {
    const response = await logoutUser();

    if (response === true) {
      dispatch(authActions.logout());
    } else {
      Alert.alert(response?.error);
    }
  }

  if (loader) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <CustomTextInput
          style={styles.aboutText}
          value={about}
          label={"О себе"}
          multiline={true}
          onChangeText={onAboutChange}
          helperVisible={aboutError}
          helperText={`Максимальное количество символов ${MAX_ABOUT_SYMBOLS}`}
        />
        <CustomText style={styles.aboutCounter}>
          {MAX_ABOUT_SYMBOLS - about.length}
        </CustomText>
        <CustomButton onPress={saveChanges} mode={"contained"}>
          Save Changes
        </CustomButton>
      </View>
      <CustomButton onPress={onLogout} mode={"contained"}>
        Log Out
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  main: {
    flex: 1,
  },
  aboutText: {
    height: 100,
  },
  aboutCounter: {
    position: "absolute",
    color: "white",
    fontSize: 14,
    right: 10,
    top: 0,
  },
});
