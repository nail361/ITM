import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Parse from "parse/react-native.js";

const config = Constants.expoConfig?.web?.config?.parse;

let currentUser = null;
let userId = null;

export function _init() {
  Parse.setAsyncStorage(AsyncStorage);
  Parse.initialize(config.apiKey);
  Parse.serverURL = config.domain;
}

async function getUserId() {
  if (userId === null) {
    if (currentUser === null) {
      await _getCurrentUser();
      userId = currentUser._getId();
    } else {
      userId = currentUser.objectId;
    }
  }

  return userId;
}

async function getServerTime() {
  const response = await Parse.Cloud.run("getServerTime");
  return response.time;
}

export async function _getCurrentUser() {
  if (currentUser === null) {
    currentUser = await Parse.User.currentAsync();
  }

  return currentUser;
}

export async function _createUser(name, email, password) {
  const user = new Parse.User();
  user.set("username", name);
  user.set("password", password);
  user.set("email", email);

  return await user
    .signUp()
    .then((createdUser) => {
      return createdUser;
    })
    .catch((error) => {
      return { error: error.message };
    });
}

export async function _loginUser(name, password) {
  return await Parse.User.logIn(name, password)
    .then(async (loggedInUser) => {
      // To verify that this is in fact the current user, currentAsync can be used
      // const currentUser = await Parse.User.currentAsync();
      // console.log(loggedInUser === currentUser);
      return loggedInUser;
    })
    .catch((error) => {
      // Error can be caused by wrong parameters or lack of Internet connection
      console.log("Error!", error.message);
      return { error: error.message };
    });
}

export async function _logoutUser() {
  return await Parse.User.logOut()
    .then(async () => {
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.currentAsync();
      if (currentUser === null) {
        return true;
      }
    })
    .catch((error) => {
      console.log("Error!", error.message);
      return { error: error.message };
    });
}

export async function _publishVideo(video, thumbnail, data, callback) {
  const uid = await getUserId();

  const thumbnailFile = await uploadThumbnail(uid, thumbnail);
  const videoFile = await uploadVideo(uid, video, callback);

  const timestamp = await getServerTime();

  const Video = Parse.Object.extend("Video");
  const videoObj = new Video();
  videoObj.set("owner", uid);
  videoObj.set("video", videoFile);
  videoObj.set("videoUrl", videoFile.url());
  videoObj.set("thumbnail", thumbnailFile);
  videoObj.set("thumbnailUrl", thumbnailFile.url());
  videoObj.set("description", data.description);
  videoObj.set("location", data.location);
  videoObj.set("lifetime", data.lifetime);
  videoObj.set("privacy", data.privacy);
  videoObj.set("likes", 0);
  videoObj.set("dislikes", 0);
  videoObj.set("expireAt", timestamp + data.lifetime * 60);

  return await videoObj.save();
}

async function uploadThumbnail(uid, thumbnail) {
  // const path = `video/${uid}/thumbnail`;
  const file = new Parse.File(`thumbnail-${uid}`, thumbnail, "image/jpeg");
  return await file.save();
}

async function uploadVideo(uid, video, callback) {
  const file = new Parse.File(`video-${uid}`, video, "video/mp4");
  return await file.save({
    progress: (value) => {
      if (value !== 0) callback(value * 100);
    },
  });
}

export async function _getMyVideos() {
  const uid = await getUserId();
  const serverTime = await getServerTime();

  const video = Parse.Object.extend("Video");
  const query = new Parse.Query(video);
  query.equalTo("owner", uid);
  query.greaterThan("expireAt", serverTime);
  const results = await query.find();

  const response = [];
  results.forEach((video) => {
    const data = {
      videoUrl: video.get("videoUrl"),
      thumbnailUrl: video.get("thumbnailUrl"),
      likes: video.get("likes"),
      dislikes: video.get("dislikes"),
      description: video.get("description"),
      expireAt: video.get("expireAt"),
      privacy: video.get("privacy"),
      lifetime: video.get("lifetime"),
      createdAt: video.get("createdAt"),
    };
    response.push({ id: video.id, serverTime, ...data });
  });

  return response;
}

export async function _removeVideo(id) {
  return await Parse.Cloud.run("deleteVideo", {
    id,
  });
}
