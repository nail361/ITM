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
import { getMyVideos, removeVideo } from "../../utils/db";
import Loading from "../ui/loading";
import CustomText from "../ui/text";

function Video(props) {
  const { showPreview, onVideoRemove } = props;
  const { id, videoUrl, thumbnailUrl, createdAt, lifetime, likes, dislikes } =
    props.data;

  return (
    <TouchableOpacity
      style={styles.video}
      onPress={() => showPreview(videoUrl)}
    >
      <Image style={styles.thumbnail} source={{ uri: thumbnailUrl }} />
      <Entypo style={styles.timer} name="stopwatch" size={20} color="white" />
      <Pressable style={styles.removeBtn} onPress={() => onVideoRemove(id)}>
        <Entypo name="cup" size={20} color="red" />
      </Pressable>
      <LinearGradient
        colors={["transparent", "rgba(255,255,255,0.8)"]}
        style={styles.videoLeftPanel}
      />
      <View style={styles.likes}>
        <View style={styles.likeRow}>
          <Entypo name="thumbs-up" size={16} color="green" />
          <CustomText style={styles.likeText}>{likes}</CustomText>
        </View>
        <View style={styles.likeRow}>
          <Entypo name="thumbs-down" size={16} color="red" />
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

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    const response = await getMyVideos();
    setVideos(response);
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

  async function onVideoRemove(videoId) {
    setLoading(true);

    const response = await removeVideo(videoId);
    if (response.error) {
      Alert.alert(response.error);
    }

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
        <Pressable
          style={styles.videoPreviewWrapper}
          onPress={() => setPreview(null)}
        >
          <VideoPlayer
            ref={videoPlayer}
            style={styles.videoPreview}
            source={{
              uri: preview,
            }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onLoad={videoLoaded}
          />
          {videoLoading && <Loading style={styles.videoLoading} />}
        </Pressable>
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
            showPreview={showPreview}
            onVideoRemove={onVideoRemove}
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
    color: "red",
    marginLeft: 5,
  },
  likeText: {
    fontSize: 16,
    color: "green",
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
  removeBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    opacity: 0.8,
  },
});
