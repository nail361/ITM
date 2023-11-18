import { Entypo } from "@expo/vector-icons";
import { Video as VideoPlayer, ResizeMode } from "expo-av";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Pressable } from "react-native";

import Loading from "../ui/loading";
import CustomText from "../ui/text";
import { Colors } from "../../utils/colors";

function VideoPreview(props) {
  const {
    id,
    videoUrl,
    likes,
    dislikes,
    description,
    onLike,
    onDislike,
    onClosePreview,
  } = props;
  const [videoLoading, setVideoLoading] = useState(true);
  const videoPlayer = useRef(null);

  function videoLoaded() {
    setVideoLoading(false);
    videoPlayer.current.playAsync();
  }

  return (
    <View style={styles.videoPreviewWrapper}>
      <Pressable style={styles.exitPreviewBtn} onPress={onClosePreview}>
        <Entypo name="circle-with-cross" size={30} color="white" />
      </Pressable>
      <View style={styles.infoPanel}>
        <Pressable style={styles.counterWrapper} onPress={() => onLike(id)}>
          <Entypo name="thumbs-up" size={24} color="white" />
          <CustomText style={styles.counterText}>{likes}</CustomText>
        </Pressable>
        <Pressable style={styles.counterWrapper} onPress={() => onDislike(id)}>
          <Entypo name="thumbs-down" size={24} color="white" />
          <CustomText style={styles.counterText}>{dislikes}</CustomText>
        </Pressable>
        <CustomText style={styles.description}>{description}</CustomText>
      </View>
      <VideoPlayer
        ref={videoPlayer}
        style={styles.videoPreview}
        source={{
          uri: videoUrl,
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onLoad={videoLoaded}
      />
      {videoLoading && <Loading style={styles.videoLoading} />}
    </View>
  );
}

export default VideoPreview;

const styles = StyleSheet.create({
  videoPreviewWrapper: {
    height: "100%",
    width: "100%",
    zIndex: 2,
    backgroundColor: Colors.bgColor,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  videoPreview: {
    width: "100%",
    height: "83%",
  },
  videoLoading: {
    backgroundColor: "transparent",
    position: "absolute",
  },
  infoPanel: {
    position: "absolute",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 2,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "26%",
  },
  counterWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 10,
  },
  counterText: {
    marginLeft: 10,
    color: "white",
    fontSize: 20,
  },
  description: {
    width: "100%",
    height: 120,
    zIndex: 2,
    backgroundColor: Colors.mainColor,
    padding: 10,
  },
  exitPreviewBtn: {
    zIndex: 2,
    position: "absolute",
    top: 10,
    right: 10,
  },
});
