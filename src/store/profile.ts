import { createSlice } from "@reduxjs/toolkit";

interface storeProps {
  about: string;
  photo: string;
  likes: number;
  dislikes: number;
  followers: string[];
  following: string[];
}

const initialState: storeProps = {
  about: "",
  photo: "",
  likes: 0,
  dislikes: 0,
  followers: [],
  following: [],
};

const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    init(state, action) {
      state.about = action.payload.about;
      state.photo = action.payload.photo;
      state.likes = action.payload.likes;
      state.dislikes = action.payload.dislikes;
      state.followers = action.payload.followers;
      state.following = action.payload.following;
    },
    updateFollowing(state, action) {
      state.following = action.payload;
    },
    updateFollowers(state, action) {
      state.followers = action.payload;
    },
  },
});

export const profileActions = slice.actions;
export default slice.reducer;
