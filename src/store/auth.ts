import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface storeProps {
  isAuth: boolean;
  token: string;
  uid: string;
  email: string;
  createdAt: string;
  username: string;
}

const initialState: storeProps = {
  isAuth: false,
  token: "",
  uid: "",
  email: "",
  createdAt: "",
  username: "",
};

const storageItemKey = "auth";

export const checkAuth = createAsyncThunk("checkAuth", async () => {
  const storedData = await AsyncStorage.getItem(storageItemKey);
  if (storedData !== null) {
    return JSON.parse(storedData);
  }
  return "";
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.createdAt = action.payload.createdAt;
      state.username = action.payload.username;
      AsyncStorage.setItem(
        storageItemKey,
        JSON.stringify({
          token: action.payload.token,
          uid: action.payload.uid,
          email: action.payload.email,
          username: action.payload.username,
          photo: action.payload.photo,
        }),
      );
    },
    logout(state) {
      state.isAuth = false;
      state.token = "";
      state.email = "";
      state.uid = "";
      state.createdAt = "";
      state.username = "";
      AsyncStorage.removeItem(storageItemKey);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isAuth = action.payload !== "";
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.createdAt = action.payload.createdAt;
      state.username = action.payload.username;
    });
  },
});

export const authActions = slice.actions;
export default slice.reducer;
