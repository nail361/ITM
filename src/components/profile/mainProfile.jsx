import { useRoute } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import UserInfo from "./userInfo";
import UserMoments from "./userMoments";

export default function MainProfile() {
  const { profileRoute } = useRoute().params;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: profileRoute.name === "MyProfile" ? insets.top + 10 : 10,
        },
      ]}
    >
      <UserInfo profileRoute={profileRoute} />
      <UserMoments profileRoute={profileRoute} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
