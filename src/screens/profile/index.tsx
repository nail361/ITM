import {
  useRoute,
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState, useCallback } from "react";
import { Alert, View } from "react-native";
import { useDispatch } from "react-redux";

import EditProfile from "../../components/profile/editProfile";
import Followers from "../../components/profile/followers";
import Following from "../../components/profile/following";
import MainProfile from "../../components/profile/mainProfile";
import Loading from "../../components/ui/loading";
import { profileActions } from "../../store/profile";
import { getUserInfo } from "../../utils/db";

const Stack = createNativeStackNavigator();

function Profile() {
  const [loader, setLoader] = useState(false);

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
        title: "Выйти из профиля",
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
            title: "Редактирование профиля",
          }}
        />
      )}
      <Stack.Screen
        name="followers"
        component={Followers}
        initialParams={{ profileRoute: route }}
        options={{
          title: "Подписчики",
        }}
      />
      <Stack.Screen
        name="following"
        component={Following}
        initialParams={{ profileRoute: route }}
        options={{
          title: "Подписки",
        }}
      />
    </Stack.Navigator>
  );
}

export default Profile;
