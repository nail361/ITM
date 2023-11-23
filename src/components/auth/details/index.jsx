import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Alert } from "react-native";
import { useDispatch } from "react-redux";

import styles from "./styles";
import { authActions } from "../../../store/auth";
import { createUser, loginUser } from "../../../utils/db";
import CustomButton from "../../ui/button";
import Loading from "../../ui/loading";
import CustomTextInput from "../../ui/textInput";

export default function AuthDetails(props) {
  const { route } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [correctData, setCorrectData] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
    }

    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <CustomTextInput
        onChangeText={(text) => setName(text)}
        style={styles.textIn}
        label={t("auth.name_field")}
        inputMode="text"
        value={name}
      />
      {authPage !== 0 && (
        <CustomTextInput
          onChangeText={(text) => setEmail(text)}
          style={styles.textIn}
          label={t("auth.email_field")}
          inputMode="email"
          value={email}
        />
      )}
      <CustomTextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textIn}
        label={t("auth.password_field")}
        secureTextEntry={true}
        value={password}
      />
      <CustomButton disabled={!correctData} onPress={onSubmit}>
        {authPage === 0 ? t("auth.sign_in_btn") : t("auth.sign_up_btn")}
      </CustomButton>
    </View>
  );
}
