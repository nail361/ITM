import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Pressable, Text, View, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import styles from "./styles";
import MyMoments from "../../components/profile/myMoments";
import UserInfo from "../../components/profile/userInfo";
import CustomButton from "../../components/ui/button";
import { RootState } from "../../store";
import { authActions } from "../../store/auth";
import { Colors } from "../../utils/colors";
import { logoutUser } from "../../utils/db";

type TitleProps = {
  title: string;
};

function Title(props: TitleProps) {
  return <Text style={styles.headerTitle}>{props.title}</Text>;
}

function Profile() {
  const name = useSelector((state: RootState) => state.auth.displayName);
  const email = useSelector((state: RootState) => state.auth.email);
  const photo = useSelector((state: RootState) => state.auth.photo);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props: any) => <Title title={name} />,
      headerRight: () => (
        <Pressable>
          <Entypo name="menu" size={32} color={Colors.mainColor} />
        </Pressable>
      ),
    });
  }, []);

  const user = {
    email,
    name,
    photo,
  };

  async function onLogout() {
    const response = await logoutUser();

    if (response === true) {
      dispatch(authActions.logout());
      //@ts-ignore
      navigation.replace("Auth");
    } else {
      Alert.alert(response?.error);
    }
  }

  return (
    <View style={styles.container}>
      <UserInfo user={user} />
      <MyMoments />
      <CustomButton onPress={onLogout} mode={"contained"}>
        Log Out
      </CustomButton>
    </View>
  );
}

export default Profile;
