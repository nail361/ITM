import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../../store/auth";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import CustomButton from "../../ui/button";

import styles from "./styles";
import { createUser, loginUser } from "../../../utils/auth";
import Loading from "../../ui/loading";
import { useNavigation } from "@react-navigation/native";

export default function AuthDetails(props) {
  const { route } = props;
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [correctData, setCorrectData] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const authPage = route.params.authPage;

  useEffect(() => {
    if (email.length >= 3 && password.length >= 5) setCorrectData(true);
    else setCorrectData(false);
  }, [email, password]);

  function onSubmit() {
    if (authPage === 0) {
      onLoginUser();
    } else onCreateUser();
  }

  async function onCreateUser() {
    setLoading(true);
    try {
      const response = await createUser(email, password);
      dispatch(
        authActions.login({
          token: response._tokenResponse.idToken,
          email: response._tokenResponse.email,
          uid: response._tokenResponse.localId,
        }),
      );
      navigation.replace("Main");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function onLoginUser() {
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      console.log(response);
      dispatch(
        authActions.login({
          token: response._tokenResponse.idToken,
          email: response._tokenResponse.email,
          uid: response._tokenResponse.uid,
        }),
      );
      navigation.replace("Main");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.textIn}
        placeholder="Email"
        inputmode="email"
        keyboardType="email-address"
        value={email}
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textIn}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
      />
      <CustomButton disabled={!correctData} onPress={onSubmit}>
        {authPage === 0 ? "Sign In" : "Sign Up"}
      </CustomButton>
    </View>
  );
}
