import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useDispatch } from "react-redux";

import CustomButton from "../../components/ui/button";
import { authActions } from "../../store/auth";
import { useNavigation } from "@react-navigation/native";

function Profile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  function onLogout() {
    dispatch(authActions.logout());
    //@ts-ignore
    navigation.replace("Auth");
  }

  return (
    <View>
      <Text>Profile Screen</Text>
      <CustomButton onPress={onLogout}>Log Out</CustomButton>
    </View>
  );
}

export default Profile;
