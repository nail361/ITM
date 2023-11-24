import { Entypo } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  Dimensions,
  Modal,
} from "react-native";

import Preview from "./preview";
import { Colors } from "../../utils/colors";
import { getUserVideos, removeVideo, getServerTime } from "../../utils/db";
import Loading from "../ui/loading";
import CustomText from "../ui/text";

const HORIZONTAL_PADDING = 15;

function Video(props) {
  const { showPreview, serverTime } = props;
  const {
    id,
    videoUrl,
    thumbnailUrl,
    expireAt,
    likes,
    dislikes,
    privacy,
    location,
  } = props.data;

  const windowWidth = Dimensions.get("window").width;
  const videoWidth = windowWidth / 3 - 15;
  const videoHeight = videoWidth;

  const max_with = videoWidth - 40;
  let current_with = (max_with * (expireAt - serverTime)) / 3600;
  current_with = Math.max(1, current_with);
  current_with = Math.min(max_with, current_with);

  return (
    <TouchableOpacity
      style={[styles.video, { width: videoWidth, height: videoHeight }]}
      onPress={() =>
        showPreview({ videoUrl, likes, dislikes, privacy, id, location })
      }
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

export default function UserMoments() {
  const { t } = useTranslation();
  const { profileRoute } = useRoute().params;
  const [videos, setVideos] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverTime, setServerTime] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    let response = null;
    if (profileRoute.name === "MyProfile") response = await getUserVideos();
    else response = await getUserVideos(profileRoute.params.uid);

    setVideos(response);

    const serverTime = await getServerTime();
    setServerTime(serverTime);

    setLoading(false);
  }

  function showPreview(data) {
    setPreview(data);
  }

  function onVideoRemoveConfirm(videoId) {
    Alert.alert(
      t("profile.remove_video_confirm.header"),
      t("profile.remove_video_confirm.text"),
      [
        {
          text: t("profile.remove_video_confirm.cancel"),
        },
        {
          text: t("profile.remove_video_confirm.submit"),
          onPress: () => onVideoRemove(videoId),
        },
      ],
    );
  }

  function onVideoClose() {
    setPreview(null);
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

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={preview !== null}
        onRequestClose={() => {
          onVideoClose();
        }}
      >
        <Preview
          preview={preview}
          myProfile={profileRoute.name === "MyProfile"}
          onVideoRemove={onVideoRemoveConfirm}
          onVideoClose={onVideoClose}
        />
      </Modal>
      <FlatList
        refreshing={loading}
        onRefresh={fetchVideos}
        contentContainerStyle={styles.videos}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          marginBottom: 10,
        }}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  videos: {},
  video: {
    backgroundColor: "grey",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.mainColor,
    marginRight: 10,
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
});
