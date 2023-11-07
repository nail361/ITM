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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { Provider } from "react-redux";

import CustomButton from "./src/components/ui/button";
import Auth from "./src/screens/auth";
import Globe from "./src/screens/globe";
import Local from "./src/screens/local";
import Moment from "./src/screens/moment";
import Profile from "./src/screens/profile";
import store from "./src/store";
import { checkAuth } from "./src/store/auth";
import { Colors } from "./src/utils/colors";
import { initFirebase } from "./src/utils/firebase";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// SplashScreen.preventAutoHideAsync();

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
    initFirebase();

    onGiveLoacation();

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

  async function onGiveLoacation() {
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
        <Text>You cannot use the application without a location</Text>
        <CustomButton onPress={openSettings}>Give a permission</CustomButton>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  const devideWidth = Dimensions.get("window").width;

  function Tabs() {
    return (
      <Tab.Navigator
        initialRouteName="Globe"
        screenOptions={{
          tabBarActiveTintColor: Colors.mainTextColor,
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
    );
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.mainColor,
      secondary: Colors.secondColor,
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
              initialRouteName={isAuth ? "Main" : "Auth"}
              screenOptions={{
                headerBackVisible: false,
                headerShown: false,
              }}
            >
              <Stack.Screen name="Auth" component={Auth} />
              <Stack.Screen name="Main" component={Tabs} />
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
