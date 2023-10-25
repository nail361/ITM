import Constants from "expo-constants";
import { useCallback } from "react";
import { Provider, useSelector } from "react-redux";
import { RootState } from "../../store";
import { Entypo, Fontisto } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, SafeAreaView, Dimensions } from "react-native";

import Globe from "./src/screens/globe";
import Local from "./src/screens/local";
import Moment from "./src/screens/moment";
import Profile from "./src/screens/profile";
import Auth from "./src/screens/auth";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import store from "./src/store";

const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

// const firebaseConfig = Constants.expoConfig?.web?.config?.firebase;
/*
let app = null;
let auth: any = null;

if (!firebaseConfig) {
  console.log("NO FIREBASE CONFIG!!!");
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}
*/
export default function App() {
  // const token = useSelector((state: RootState) => state.auth.token);

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

  if (!fontsLoaded) {
    return null;
  }

  const devideWidth = Dimensions.get("window").width;

  if (true)
    return (
      <Provider store={store}>
        <SafeAreaView style={styles.mainView} onLayout={onLayoutRootView}>
          <Auth />
        </SafeAreaView>
      </Provider>
    );

  return (
    <Provider store={store}>
      <View onLayout={onLayoutRootView} style={styles.mainView}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Globe"
            screenOptions={{
              tabBarActiveTintColor: "blue",
            }}
          >
            <Tab.Screen
              name="Globe"
              component={Globe}
              options={{
                title: "Globe",
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="globe" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Record"
              component={Moment}
              options={{
                title: "Moment",
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="video-camera" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Local"
              component={Local}
              options={{
                title: "Local",
                tabBarIcon: ({ color, size }) => (
                  <Fontisto name="map-marker-alt" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{
                title: "My Profile",
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="v-card" size={24} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </View>
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
