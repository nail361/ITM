import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

interface storeProps {
  isAuth: boolean;
  email: string;
  token: string;
}

let initialState: storeProps = {
  isAuth: false,
  email: "",
  token: "",
};

const storageItemKey = "token";

async function fetchToken() {
  const storedToken = await AsyncStorage.getItem(storageItemKey);

  if (storedToken !== null) {
    initialState = {
      isAuth: true,
      email: "",
      token: storedToken,
    };
  }
}

fetchToken();

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
      AsyncStorage.setItem(storageItemKey, action.payload.token);
    },
    logout(state) {
      state.isAuth = false;
      AsyncStorage.removeItem(storageItemKey);
    },
  },
});

export const authActions = slice.actions;
export default slice.reducer;
