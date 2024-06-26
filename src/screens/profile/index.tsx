import {
  useRoute,
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";
import { useDispatch } from "react-redux";

import EditProfile from "../../components/profile/editProfile";
import Followers from "../../components/profile/followers";
import Following from "../../components/profile/following";
import MainProfile from "../../components/profile/mainProfile";
import Search from "../../components/profile/search";
import Loading from "../../components/ui/loading";
import { profileActions } from "../../store/profile";
import { getUserInfo } from "../../utils/db";

const Stack = createNativeStackNavigator();

function Profile() {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("FOCUS");
  //     if (route.name === "UserProfile") {
  //       navigation.setOptions({
  //         headerShown: true,
  //         title: "",
  //         headerBackVisible: true,
  //       });
  //     }
  //   }, []),
  // );

  useEffect(() => {
    if (route.name === "UserProfile") {
      navigation.setOptions({
        headerShown: true,
        title: t("profile.profile_header"),
        headerBackVisible: true,
      });
    }
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    setLoader(true);
    const response = await getUserInfo();

    if (response.error) {
      Alert.alert(response.error);
    } else {
      dispatch(profileActions.init(response));
    }

    setLoader(false);
  }

  if (loader) {
    return (
      <View style={{ flex: 1 }}>
        <Loading />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="mainProfile">
      <Stack.Screen
        name="mainProfile"
        component={MainProfile}
        initialParams={{ profileRoute: route }}
        options={{
          headerShown: false,
        }}
      />
      {route.name === "MyProfile" && (
        <Stack.Screen
          name="editProfile"
          component={EditProfile}
          options={{
            title: t("profile.edit_profile_header"),
          }}
        />
      )}
      <Stack.Screen
        name="followers"
        component={Followers}
        initialParams={{ profileRoute: route }}
        options={{
          title: t("profile.followers"),
        }}
      />
      <Stack.Screen
        name="following"
        component={Following}
        initialParams={{ profileRoute: route }}
        options={{
          title: t("profile.following"),
        }}
      />
      <Stack.Screen
        name="search"
        component={Search}
        options={{
          title: t("profile.search_header"),
        }}
      />
    </Stack.Navigator>
  );
}

export default Profile;
