import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [about, setAbout] = useState(
    useSelector((state) => state.profile.about),
  );
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  function onAboutChange(aboutText) {
    setAbout(aboutText);
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
          label={t("profile.about")}
          multiline={true}
          onChangeText={onAboutChange}
          helperVisible={about.length > MAX_ABOUT_SYMBOLS}
          helperText={`${t("profile.max_symbols")} ${MAX_ABOUT_SYMBOLS}`}
        />
        <CustomText style={styles.aboutCounter}>
          {MAX_ABOUT_SYMBOLS - about.length}
        </CustomText>
        <CustomButton onPress={saveChanges} mode={"contained"}>
          {t("profile.about_save_btn")}
        </CustomButton>
      </View>
      <CustomButton onPress={onLogout} mode={"contained"}>
        {t("profile.logout_btn")}
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
