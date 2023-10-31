import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { Video, ResizeMode } from "expo-av";
import CustomButton from "../ui/button";
import { Colors } from "../../utils/colors";
import { publishVideo } from "../../utils/firebase";
import UploadProgress from "./UploadProgress";

export default function SaveVideo(props) {
  const [status, setStatus] = useState({});
  const [isUploading, setUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [videoDescription, setDesctiption] = useState("");
  const [videoPrivacy, setPrivacy] = useState("public");
  const [videoLifetime, setLifetime] = useState(60);
  const video = useRef(null);
  const { videoUri, cancelPublish } = props;

  useEffect(() => {
    video.current.playAsync();
  }, []);

  async function onPublish() {
    const location = await Location.getCurrentPositionAsync();
    const data = {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      description: videoDescription,
      lifetime: videoLifetime,
      privacy: videoPrivacy,
    };

    fetch(videoUri)
      .then((response) => response.blob())
      .then((blob) => {
        setUploading(true);
        publishVideo(blob, data, onUploadProgress);
      });
  }

  function onUploadProgress(progress) {
    setUploadingProgress(progress);
    if (progress === 100) {
      setUploading(false);
      cancelPublish();
    }
  }

  if (isUploading) {
    return (
      <View style={styles.container}>
        <UploadProgress progress={uploadingProgress} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Pressable
          style={styles.playBtn}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        />
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: videoUri,
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(status)}
        />
      </View>
      <View style={styles.videoInfo}>
        <TextInput
          style={styles.description}
          maxLength={150}
          multiline
          placeholder="Description"
          value={videoDescription}
          onChangeText={(text) => setDesctiption(text)}
        />
      </View>
      <View style={styles.buttons}>
        <CustomButton onPress={cancelPublish}>{"Cancel"}</CustomButton>
        <CustomButton onPress={onPublish}>{"Publish"}</CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  videoContainer: {
    position: "relative",
    flex: 1,
  },
  playBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  videoInfo: {
    height: 100,
    padding: 20,
    width: "100%",
    backgroundColor: Colors.secondColor,
  },
  description: {
    width: "100%",
  },
  buttons: {
    height: 80,
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.mainColor,
  },
  video: {
    flex: 1,
  },
});
