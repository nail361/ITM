import { createNativeStackNavigator } from "@react-navigation/native-stack";

import styles from "./styles";
import AuthDetails from "../../components/auth/details";
import AuthMenu from "../../components/auth/menu/index.jsx";
import { Colors } from "../../utils/colors";

const Stack = createNativeStackNavigator();

export default function Auth() {
  return (
    <Stack.Navigator
      initialRouteName="AuthMenu"
      screenOptions={{
        headerTintColor: Colors.headerTextColor,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="AuthMenu" component={AuthMenu} />
      <Stack.Screen
        name="AuthDetail"
        component={AuthDetails}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
}
