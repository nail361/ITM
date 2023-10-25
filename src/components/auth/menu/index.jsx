import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";

import styles from "./styles";
import { Colors } from "../../../utils/colors";

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
            <Entypo name="email" size={24} color="black" />
            <Text>UseEmail</Text>
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
            <Text style={styles.signUpText}>
              Don't have an account?
              <Text style={[styles.signUpText, styles.boldText]}> Sign up</Text>
            </Text>
          ) : (
            <Text style={styles.signUpText}>
              Already have an account?
              <Text style={[styles.signUpText, styles.boldText]}> Sign in</Text>
            </Text>
          )}
        </LinearGradient>
      </Pressable>
    </>
  );
}
