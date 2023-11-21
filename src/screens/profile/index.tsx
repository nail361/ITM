import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { useDispatch } from "react-redux";

import EditProfile from "../../components/profile/editProfile";
import Followers from "../../components/profile/followers";
import Following from "../../components/profile/following";
import MainProfile from "../../components/profile/mainProfile";
import Loading from "../../components/ui/loading";
import { profileActions } from "../../store/profile";
import { getMyInfo } from "../../utils/db";

const Stack = createNativeStackNavigator();

function Profile() {
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    setLoader(true);
    const response = await getMyInfo();

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
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="editProfile"
        component={EditProfile}
        options={{
          title: "Редактирование профиля",
        }}
      />
      <Stack.Screen
        name="followers"
        component={Followers}
        options={{
          title: "Подписчики",
        }}
      />
      <Stack.Screen
        name="following"
        component={Following}
        options={{
          title: "Подписки",
        }}
      />
    </Stack.Navigator>
  );
}

export default Profile;
