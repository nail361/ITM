import { Entypo } from "@expo/vector-icons";
import { Video as VideoPlayer, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";

import { Colors } from "../../utils/colors";
import { getMyVideos, removeVideo, getServerTime } from "../../utils/db";
import Loading from "../ui/loading";
import CustomText from "../ui/text";

function Video(props) {
  const { showPreview, serverTime } = props;
  const { id, videoUrl, thumbnailUrl, expireAt, likes, dislikes, privacy } =
    props.data;

  const max_with = 80;
  let current_with = (max_with * (expireAt - serverTime)) / 3600;
  current_with = Math.max(1, current_with);
  current_with = Math.min(max_with, current_with);

  return (
    <TouchableOpacity
      style={styles.video}
      onPress={() => showPreview({ videoUrl, privacy, id })}
    >
      <Image style={styles.thumbnail} source={{ uri: thumbnailUrl }} />
      <Entypo style={styles.timer} name="stopwatch" size={20} color="white" />
      <View style={[styles.timerProgress, { width: current_with }]} />
      <View style={[styles.timerProgressBg, { width: max_with }]} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.videoLeftPanel}
      />
      <View style={styles.likes}>
        <View style={styles.likeRow}>
          <Entypo name="thumbs-up" size={16} color="white" />
          <CustomText style={styles.likeText}>{likes}</CustomText>
        </View>
        <View style={styles.likeRow}>
          <Entypo name="thumbs-down" size={16} color="white" />
          <CustomText style={styles.dislikeText}>{dislikes}</CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MyMoments() {
  const [videos, setVideos] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoPlayer = useRef(null);
  const [serverTime, setServerTime] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    const response = await getMyVideos();
    setVideos(response);

    const serverTime = await getServerTime();
    setServerTime(serverTime);

    setLoading(false);
  }

  function showPreview(url) {
    setPreview(url);
    setVideoLoading(true);
  }

  function videoLoaded() {
    setVideoLoading(false);
    videoPlayer.current.playAsync();
  }

  function onVideoRemoveConfirm(videoId) {
    Alert.alert("Remove video", "Are you shure to remove video?", [
      {
        text: "Cancel",
      },
      { text: "OK", onPress: () => onVideoRemove(videoId) },
    ]);
  }

  async function onVideoRemove(videoId) {
    setLoading(true);

    const response = await removeVideo(videoId);
    if (response.error) {
      Alert.alert(response.error);
    }

    setPreview(null);

    fetchVideos();
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {preview && (
        <>
          <View style={styles.privacy}>
            <Entypo
              name={preview.privacy === "private" ? "lock" : "lock-open"}
              size={20}
              color="white"
            />
            <CustomText style={styles.privacyText}>
              {preview.privacy}
            </CustomText>
          </View>
          <Pressable
            style={styles.removeBtn}
            onPress={() => onVideoRemoveConfirm(preview.id)}
          >
            <Entypo name="cup" size={35} color="white" />
          </Pressable>
          <Pressable
            style={styles.videoPreviewWrapper}
            onPress={() => setPreview(null)}
          >
            <VideoPlayer
              ref={videoPlayer}
              style={styles.videoPreview}
              source={{
                uri: preview.videoUrl,
              }}
              useNativeControls={false}
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onLoad={videoLoaded}
            />
            {videoLoading && <Loading style={styles.videoLoading} />}
          </Pressable>
        </>
      )}
      <FlatList
        contentContainerStyle={styles.videos}
        numColumns={3}
        removeClippedSubviews
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Video
            data={item}
            serverTime={serverTime}
            showPreview={showPreview}
          />
        )}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videos: {
    flex: 1,
    paddingHorizontal: 20,
  },
  video: {
    flex: 1 / 3,
    width: 100,
    height: 100,
    backgroundColor: "grey",
    marginHorizontal: 5,
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.mainColor,
  },
  thumbnail: {
    flex: 1,
  },
  likes: {
    position: "absolute",
    bottom: 8,
    left: 5,
    flexDirection: "column",
    height: 40,
    justifyContent: "space-between",
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
  dislikeText: {
    fontSize: 16,
    color: "white",
    marginLeft: 5,
  },
  likeText: {
    fontSize: 16,
    color: "white",
    marginLeft: 5,
  },
  videoPreviewWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.secondColor,
    zIndex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  videoLoading: {
    backgroundColor: "transparent",
    position: "absolute",
  },
  videoLeftPanel: {
    width: "100%",
    height: 60,
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  timer: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  timerProgress: {
    position: "absolute",
    top: 15,
    left: 30,
    height: 5,
    backgroundColor: "white",
    borderRadius: 5,
  },
  timerProgressBg: {
    position: "absolute",
    top: 15,
    left: 30,
    height: 5,
    borderColor: "#00000030",
    borderWidth: 1,
    borderRadius: 5,
  },
  removeBtn: {
    position: "absolute",
    bottom: 15,
    right: 20,
    zIndex: 2,
    backgroundColor: Colors.mainColor,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  privacy: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    top: 10,
    right: 15,
    zIndex: 2,
  },
  privacyText: {
    color: "white",
  },
});
