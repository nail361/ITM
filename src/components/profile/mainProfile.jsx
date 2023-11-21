import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MyMoments from "./myMoments";
import UserInfo from "./userInfo";

export default function MainProfile() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <UserInfo />
      <MyMoments />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
