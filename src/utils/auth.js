import axios from "axios";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.web?.config?.firebase?.apiKey;

export async function loginUser(email, password) {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    },
  );

  return response;
}

export async function createUser(email, password) {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    },
  );

  return response;
}
