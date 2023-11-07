import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface storeProps {
  isAuth: boolean;
  token: string;
  uid: string;
  email: string;
  createdAt: string;
  displayName: string;
  photo: string;
}

const initialState: storeProps = {
  isAuth: false,
  token: "",
  uid: "",
  email: "",
  createdAt: "",
  displayName: "",
  photo: "",
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
      state.displayName = action.payload.displayName;
      state.photo = action.payload.photo;
      AsyncStorage.setItem(
        storageItemKey,
        JSON.stringify({
          token: action.payload.token,
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName,
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
      state.displayName = "";
      state.photo = "";
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
      state.displayName = action.payload.displayName;
      state.photo = action.payload.photo;
    });
  },
});

export const authActions = slice.actions;
export default slice.reducer;
