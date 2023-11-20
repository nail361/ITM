import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { Pressable, View } from "react-native";

import styles from "./styles";
import { Colors } from "../../../utils/colors";
import CustomText from "../../ui/text";

export default function AuthMenu(props) {
  const { navigation } = props;
  const [authPage, setAuthPage] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      title: authPage === 0 ? "Sign in" : "Sign up",
    });
  }, [navigation, authPage]);

  return (
    <>
      <View style={styles.container}>
        <Pressable
          android_ripple={{ color: Colors.secondColor, foreground: true }}
          onPress={() => navigation.navigate("AuthDetail", { authPage })}
        >
          <View style={styles.providerButton}>
            <Entypo name="email" size={24} color="white" />
            <CustomText style={styles.emailText}>UseEmail</CustomText>
          </View>
        </Pressable>
      </View>

      <Pressable
        android_ripple={{ color: Colors.secondColor, foreground: true }}
        style={styles.signUpButton}
        onPress={() => (authPage === 0 ? setAuthPage(1) : setAuthPage(0))}
      >
        <LinearGradient
          colors={[Colors.secondColor, Colors.mainColor]}
          style={styles.signUpBackground}
        >
          {authPage === 0 ? (
            <CustomText style={styles.signUpText}>
              Don't have an account?
              <CustomText style={[styles.signUpText, styles.boldText]}>
                {" "}
                Sign up
              </CustomText>
            </CustomText>
          ) : (
            <CustomText style={styles.signUpText}>
              Already have an account?
              <CustomText style={[styles.signUpText, styles.boldText]}>
                {" "}
                Sign in
              </CustomText>
            </CustomText>
          )}
        </LinearGradient>
      </Pressable>
    </>
  );
}
