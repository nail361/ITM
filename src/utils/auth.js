import axios from "axios";
import Constants from "expo-constants";
import { Alert } from "react-native";

const authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:";
const API_KEY = Constants.expoConfig?.web?.config?.firebase?.apiKey;

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

  return response;
}
