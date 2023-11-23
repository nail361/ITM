import "react-native-get-random-values";
import { Entypo, Fontisto } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { Provider } from "react-redux";

import CustomButton from "./src/components/ui/button";
import Auth from "./src/screens/auth";
import Moment from "./src/screens/moment";
import Moments from "./src/screens/moments";
import Profile from "./src/screens/profile";
import store from "./src/store";
import { checkAuth } from "./src/store/auth";
import { Colors } from "./src/utils/colors";
import { init as initDB } from "./src/utils/db";

import "./src/utils/i18n";
import { useTranslation } from "react-i18next";

import CustomText from "./src/components/ui/text";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { t } = useTranslation();
  const [isAuth, setAuth] = useState(store.getState().auth.isAuth);
  const [locationGranted, setLocationGranted] = useState(false);
  let prevValue = isAuth;

  function handleStoreChange() {
    const auth = store.getState().auth.isAuth;
    if (prevValue !== auth) {
      setAuth(auth);
      prevValue = auth;
    }
  }

  const unsubscribe = store.subscribe(handleStoreChange);

  useEffect(() => {
    store.dispatch(checkAuth());
    initDB();

    onGiveLocation();

    return () => {
      unsubscribe();
    };
  }, []);

  const [fontsLoaded] = useFonts({
    ubuntu: require("./assets/fonts/Ubuntu/Ubuntu-Regular.ttf"),
    "ubuntu-light": require("./assets/fonts/Ubuntu/Ubuntu-Light.ttf"),
    "ubuntu-bold": require("./assets/fonts/Ubuntu/Ubuntu-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  async function onGiveLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationGranted(true);
    } else setLocationGranted(false);

    return status;
  }

  function openSettings() {
    Linking.openSettings();
  }

  if (!locationGranted) {
    return (
      <View onLayout={onLayoutRootView} style={styles.container}>
        <CustomText>{t("common.location_permission.text")}</CustomText>
        <CustomButton onPress={openSettings}>
          {t("common.location_permission.btn")}
        </CustomButton>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  function Tabs() {
    return (
      <Tab.Navigator
        initialRouteName="MyProfile"
        screenOptions={{
          tabBarActiveTintColor: Colors.secondColor,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Moments"
          component={Moments}
          options={{
            title: t("common.moments"),
            tabBarIcon: ({ color, size }) => (
              <Entypo name="video" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Record"
          component={Moment}
          options={{
            title: t("common.record"),
            tabBarIcon: ({ color, size }) => (
              <Entypo name="video-camera" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MyProfile"
          component={Profile}
          options={{
            title: t("common.profile"),
            tabBarIcon: ({ color, size }) => (
              <Entypo name="v-card" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.mainColor,
      secondary: Colors.secondColor,
      secondaryContainer: Colors.secondColor,
    },
    // fonts: {
    //   fontFamily: "ubintu",
    // },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <View onLayout={onLayoutRootView} style={styles.mainView}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerBackVisible: false,
                headerShown: false,
              }}
            >
              {!isAuth ? (
                <Stack.Screen name="Auth" component={Auth} />
              ) : (
                <>
                  <Stack.Screen name="Main" component={Tabs} />
                  <Stack.Screen name="UserProfile" component={Profile} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
