import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getReactNativePersistence,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  Timestamp,
  collection,
  addDoc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Alert } from "react-native";
import uuid from "uuid-random";

let app = null;
let auth = null;
let db = null;
let storage = null;

export function _init() {
  if (app != null) return;

  app = initializeApp(Constants.expoConfig?.web?.config?.firebase);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  db = getFirestore(app);
  storage = getStorage(app);

  return auth;
}

export function getServetTime() {
  return Timestamp.now().seconds;
}

export async function createUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log("USER");
      console.log(user);
      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          createdAt: user.createdAt || getServetTime(),
          displayName: user.displayName || "",
          photo: user.photoURL || "",
        });
        console.log("Document written with ID: ", docRef.id);
        return userCredential;
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      Alert.alert("Failed to sign up", errorMessage);
    });
}

export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      return userCredential;
    })
    .catch((error) => {
      const errorMessage = error.message;
      Alert.alert("Failed to sign in", errorMessage);
    });
}

export async function logoutUser() {
  signOut(auth);
}

export async function publishVideo(video, thumbnail, data, callback) {
  const uniqId = uuid();

  const thumbnailURL = await uploadThumbnail(uniqId, thumbnail);

  await uploadVideo(uniqId, video, thumbnailURL, data, callback);
}

async function uploadThumbnail(id, thumbnail) {
  const metadata = {
    contentType: "image/jpg",
  };

  const thumbnailRef = ref(storage, `thumbnail/${auth.currentUser.uid}/${id}`);

  return await uploadBytes(thumbnailRef, thumbnail, metadata).then(
    async (snapshot) =>
      await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
        return downloadURL;
      }),
  );
}

async function uploadVideo(id, video, thumbnail, data, callback) {
  const metadata = {
    contentType: "video/mp4",
  };

  const storageRef = ref(storage, `video/${auth.currentUser.uid}/${id}`);

  const uploadVideo = uploadBytesResumable(storageRef, video, metadata);

  uploadVideo.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      callback(progress);
      /*
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
        case "success": {
          console.log("Upload success");
        }
      }*/
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadVideo.snapshot.ref).then(async (downloadURL) => {
        //Add to firestore
        const timestamp = getServetTime();
        await setDoc(doc(db, "video", id), {
          owner: auth.currentUser.uid,
          videoUrl: downloadURL,
          description: data.description,
          location: data.location,
          lifetime: data.lifetime,
          privacy: data.privacy,
          thumbnail,
          likes: 0,
          dislikes: 0,
          createAt: timestamp,
          expireAt: timestamp + data.lifetime * 60,
        });
      });
    },
  );
}

export async function getMyVideos() {
  const _query = query(
    collection(db, "video"),
    where("owner", "==", auth.currentUser.uid),
  );
  const querySnapshot = await getDocs(_query);
  const serverTime = getServetTime();

  const response = [];
  querySnapshot.forEach((document) => {
    const data = document.data();

    if (serverTime > data.expireAt) {
      const videoRef = ref(
        storage,
        `video/${auth.currentUser.uid}/${document.id}`,
      );
      const thumbnailRef = ref(
        storage,
        `thumbnail/${auth.currentUser.uid}/${document.id}`,
      );

      deleteObject(videoRef);
      deleteObject(thumbnailRef);

      deleteDoc(doc(db, "video", document.id));
    } else response.push({ id: document.id, serverTime, ...data });
  });

  return response;
}
