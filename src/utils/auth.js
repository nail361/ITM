import axios from "axios";
import Constants from "expo-constants";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getReactNativePersistence,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
/*
const firebaseUrl =
  "https://inthemoment-8bfdf-default-rtdb.europe-west1.firebasedatabase.app";
const authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:";
const API_KEY = Constants.expoConfig?.web?.config?.firebase?.apiKey;
*/
let app = null;
let auth = null;
let db = null;

export function initFirebase() {
  app = initializeApp(Constants.expoConfig?.web?.config?.firebase);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  db = getFirestore(app);

  return auth;
}

export async function createUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;
      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
        });
        console.log("Document written with ID: ", docRef.id);
        return userCredential;
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      Alert.alert("Failed to sign up", errorMessage);
    });
}

export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return userCredential;
    })
    .catch((error) => {
      const errorMessage = error.message;
      Alert.alert("Failed to sign in", errorMessage);
    });
}

export async function logoutUser() {
  signOut(auth);
}

/*
export async function loginUser(email, password) {
  const response = await axios
    .post(`${authUrl}signInWithPassword?key=${API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    })
    .catch((error) => {
      let errorMsg = "Something went wrong, try later";
      if (error.response) {
        switch (error.response.data.error.message) {
          case "INVALID_LOGIN_CREDENTIALS":
            errorMsg =
              "There is no user record corresponding to this identifier. The user may have been deleted.";
            break;
          case "EMAIL_NOT_FOUND":
            errorMsg =
              "There is no user record corresponding to this identifier. The user may have been deleted.";
            break;
          case "INVALID_PASSWORD":
            errorMsg =
              "The password is invalid or the user does not have a password";
            break;
          case "USER_DISABLED":
            errorMsg = "The user account has been disabled by an administrator";
            break;
          case "TOO_MANY_ATTEMPTS_TRY_LATER":
            errorMsg =
              "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later";
            break;
          default:
            errorMsg = error.response.data.error.message;
            break;
        }
      }

      Alert.alert("Failed to sign in", errorMsg);
    });

  return response;
}

export async function createUser(email, password) {
  const response = await axios
    .post(`${authUrl}signUp?key=${API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    })
    .catch((error) => {
      let errorMsg = "Something went wrong, try later";
      if (error.response) {
        switch (error.response.data.error.message) {
          case "EMAIL_EXISTS":
            errorMsg = "The email address is already in use by another account";
            break;
          case "OPERATION_NOT_ALLOWED":
            errorMsg = "Password sign-in is disabled for this project";
            break;
          case "TOO_MANY_ATTEMPTS_TRY_LATER":
            errorMsg =
              "We have blocked all requests from this device due to unusual activity. Try again later";
            break;
          default:
            errorMsg = error.response.data.error.message;
            break;
        }
      }

      Alert.alert("Failed to create new user!", errorMsg);
    });

  axios
    .post(
      `${firebaseUrl}\\users.json`,
      { uid: response.data.localId, email: response.data.email },
      {
        headers: {
          Authorization: `Basic ${response.data.idToken}`,
        },
      },
    )
    .catch((error) => {
      console.log(error);
    });

  return response;
}
*/
