import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth";
import profile from "./profile";

const store = configureStore({
  reducer: {
    auth,
    profile,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
