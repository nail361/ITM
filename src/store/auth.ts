import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface storeProps {
  isAuth: boolean;
  email: string;
  localId: string;
  token: string;
}

const initialState: storeProps = {
  isAuth: false,
  email: "",
  localId: "",
  token: "",
};

const storageItemKey = "token";

export const checkAuth = createAsyncThunk("checkAuth", async () => {
  const storedToken = await AsyncStorage.getItem(storageItemKey);
  console.log(`TOKEN - ${storedToken}`);
  if (storedToken !== null) {
    return storedToken;
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
      state.localId = action.payload.localId;
      AsyncStorage.setItem(storageItemKey, action.payload.token);
    },
    logout(state) {
      state.isAuth = false;
      state.token = "";
      state.email = "";
      state.localId = "";
      AsyncStorage.removeItem(storageItemKey);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isAuth = action.payload !== "";
      state.token = action.payload;
    });
  },
});

export const authActions = slice.actions;
export default slice.reducer;
