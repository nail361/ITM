import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import styles from "./styles";
import AuthDetails from "../../components/auth/details";
import AuthMenu from "../../components/auth/menu/index.jsx";
import { Colors } from "../../utils/colors";

export const Stack = createNativeStackNavigator();

export default function Auth() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
