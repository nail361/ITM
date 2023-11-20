import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useDispatch } from "react-redux";

import styles from "./styles";
import { authActions } from "../../../store/auth";
import { createUser, loginUser } from "../../../utils/db";
import CustomButton from "../../ui/button";
import Loading from "../../ui/loading";
import CustomTextInput from "../../ui/textInput";
import { Colors } from "../../../utils/colors";

export default function AuthDetails(props) {
  const { route } = props;
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [correctData, setCorrectData] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const authPage = route.params.authPage;

  useEffect(() => {
    let correct = false;

    if (authPage === 0) {
      correct = name.length > 3 && password.length >= 5;
    } else {
      correct = name.length > 3 && email.length > 3 && password.length > 5;
    }

    setCorrectData(correct);
  }, [email, password]);

  function onSubmit() {
    if (authPage === 0) {
      onLoginUser();
    } else onCreateUser();
  }

  async function onCreateUser() {
    setLoading(true);
    const response = await createUser(name, email, password);
    console.log(response);

    if (response.error) {
      Alert.alert(response.error);
    } else {
      dispatch(
        authActions.login({
          token: response.sessionToken,
          email: response.email,
          uid: response.objectId,
          createdAt: new Date(response.createdAt).getTime() / 1000,
          username: response.username,
        }),
      );
      navigation.replace("Main");
    }

    setLoading(false);
  }

  async function onLoginUser() {
    setLoading(true);
    const response = await loginUser(name, password);

    if (response.error) {
      Alert.alert(response.error);
    } else {
      dispatch(authActions.login({ ...response }));
      navigation.replace("Main");
    }

    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <CustomTextInput
        onChangeText={(text) => setName(text)}
        style={styles.textIn}
        label="Name"
        inputMode="text"
        value={name}
      />
      {authPage !== 0 && (
        <CustomTextInput
          onChangeText={(text) => setEmail(text)}
          style={styles.textIn}
          label="Email"
          inputMode="email"
          value={email}
        />
      )}
      <CustomTextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textIn}
        label="Password"
        secureTextEntry={true}
        value={password}
      />
      <CustomButton disabled={!correctData} onPress={onSubmit}>
        {authPage === 0 ? "Sign In" : "Sign Up"}
      </CustomButton>
    </View>
  );
}
