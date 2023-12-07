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

export async function _getServerTime() {
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
  return await Parse.Cloud.run("createUser", {
    name,
    email,
    password,
  });
}

export async function _loginUser(name, password) {
  return await Parse.User.logIn(name, password)
    .then(async (loggedInUser) => {
      // To verify that this is in fact the current user, currentAsync can be used
      // const currentUser = await Parse.User.currentAsync();
      // console.log(loggedInUser === currentUser);
      const response = {
        token: loggedInUser.get("sessionToken"),
        email: loggedInUser.get("email"),
        uid: loggedInUser.get("objectId"),
        createdAt: Math.ceil(
          new Date(loggedInUser.get("createdAt")).getTime() / 1000,
        ),
        username: loggedInUser.get("username"),
      };

      return response;
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

  const timestamp = await _getServerTime();

  const location = new Parse.GeoPoint(data.location);

  const Video = Parse.Object.extend("Video");
  const videoObj = new Video();
  videoObj.set("owner", uid);
  videoObj.set("video", videoFile);
  videoObj.set("videoUrl", videoFile.url());
  videoObj.set("thumbnail", thumbnailFile);
  videoObj.set("thumbnailUrl", thumbnailFile.url());
  videoObj.set("description", data.description);
  videoObj.set("location", location);
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

export async function _getNearVideos(location, radius) {
  return await Parse.Cloud.run("getNearVideos", {
    location,
    radius,
  });
}

export async function _getUserVideos(_uid) {
  let uid = _uid;
  if (!uid) uid = await getUserId();

  return await Parse.Cloud.run("getUserVideos", {
    uid,
  });
}

export async function _removeVideo(id) {
  return await Parse.Cloud.run("deleteVideo", { id });
}

export async function _getUserInfo(_uid) {
  let uid = _uid;
  if (!uid) uid = await getUserId();

  return {
    about: "Обо мне заглушка",
    photo:
      "https://i.pinimg.com/736x/5b/6e/ca/5b6eca63605bea0eeb48db43f77fa0ce.jpg",
    likes: 456,
    dislikes: 38,
    followers: ["1", "3"],
    following: ["1", "2", "3"],
  };
  /*
  return await Parse.Cloud.run("getUserInfo", {
    uid,
  });*/
}

export async function _searchUsers(searchText) {
  return [
    {
      uid: "1",
      photo: "",
      name: "Denis",
      about: "Обо мне",
    },
    {
      uid: "2",
      photo: "",
      name: "Maxim",
      about: "Обо мне",
    },
    {
      uid: "3",
      photo: "",
      name: "Sergey",
      about: "Обо мне",
    },
  ];
}

export async function _getUsersInfo(uids, data) {
  return [
    {
      uid: "1",
      photo: "",
      name: "Denis",
      about: "Обо мне",
    },
    {
      uid: "2",
      photo: "",
      name: "Maxim",
      about: "Обо мне",
    },
    {
      uid: "3",
      photo: "",
      name: "Sergey",
      about: "Обо мне",
    },
  ];
}

export async function _saveMyInfo() {
  return true;
}

export async function _getFollowing(_uid) {
  let uid = _uid;
  if (!uid) uid = await getUserId();

  return ["1", "2", "3"];
}

export async function _getFollowers(_uid) {
  let uid = _uid;
  if (!uid) uid = await getUserId();

  return ["1", "2", "3"];
}

export async function _publishAvatar(photo) {
  const uid = await getUserId();
  return "https://img.freepik.com/free-photo/a-cupcake-with-a-strawberry-on-top-and-a-strawberry-on-the-top_1340-35087.jpg";
}
