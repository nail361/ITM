import Slider from "@react-native-community/slider";
import { Video, ResizeMode } from "expo-av";
import * as Location from "expo-location";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { SegmentedButtons } from "react-native-paper";

import UploadProgress from "./UploadProgress";
import { Colors } from "../../utils/colors";
import { publishVideo } from "../../utils/db";
import CustomButton from "../ui/button";

export default function SaveVideo(props) {
  const [status, setStatus] = useState({});
  const [isUploading, setUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [videoDescription, setDesctiption] = useState("");
  const [videoPrivacy, setPrivacy] = useState("public");
  const [videoLifetime, setLifetime] = useState(30);
  const video = useRef(null);
  const { videoUri, cancelPublish } = props;

  useEffect(() => {
    video.current.playAsync();
  }, []);

  const generateThumbnail = async (source) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, {
        time: 3000,
        quality: 0.3,
      });
      return uri;
    } catch (e) {
      console.warn(e);
    }
  };

  async function onPublish() {
    setUploading(true);
    let location = await Location.getLastKnownPositionAsync();
    if (location == null) location = await Location.getCurrentPositionAsync();

    const thumbnail = await generateThumbnail(videoUri);
    const data = {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      description: videoDescription,
      lifetime: videoLifetime,
      privacy: videoPrivacy,
    };

    const thumbnailBlob = await fetch(thumbnail)
      .then((response) => response.blob())
      .then((blob) => {
        return blob;
      });

    fetch(videoUri)
      .then((response) => response.blob())
      .then(async (blob) => {
        await publishVideo(blob, thumbnailBlob, data, onUploadProgress);
        setUploading(false);
        cancelPublish();
      });
  }

  function onUploadProgress(progress) {
    setUploadingProgress(progress);
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
        <View style={styles.privacyWrapper}>
          <SegmentedButtons
            value={videoPrivacy}
            onValueChange={setPrivacy}
            buttons={[
              {
                value: "public",
                label: "PUBLIC",
                icon: "lock-open-variant-outline",
              },
              {
                value: "private",
                label: "PRIVATE",
                icon: "lock-outline",
              },
            ]}
          />
        </View>
        <View style={styles.lifetimeWrapper}>
          <Text style={styles.text}>Lifetime</Text>
          <View style={styles.sliderTitles}>
            <Text style={styles.sliderTitle}>15m</Text>
            <Text style={styles.sliderTitle}>30m</Text>
            <Text style={styles.sliderTitle}>45m</Text>
            <Text style={styles.sliderTitle}>1h</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={60}
            step={15}
            value={videoLifetime}
            minimumTrackTintColor={Colors.mainColor}
            maximumTrackTintColor={Colors.lightTextColor}
            thumbTintColor={Colors.mainColor}
            onSlidingComplete={(value) => setLifetime(value)}
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <CustomButton style={styles.w150} onPress={cancelPublish}>
          {"Cancel"}
        </CustomButton>
        <CustomButton style={styles.w150} onPress={onPublish}>
          {"Publish"}
        </CustomButton>
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
    flexDirection: "column",
    padding: 10,
    width: "100%",
    backgroundColor: Colors.secondColor,
  },
  privacyWrapper: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },
  description: {
    fontFamily: "ubuntu",
    width: "100%",
    height: 50,
    marginTop: 5,
    padding: 5,
    color: "black",
    verticalAlign: "top",
    backgroundColor: Colors.lightTextColor,
  },
  text: {
    fontFamily: "ubuntu",
    color: "white",
    fontSize: 18,
  },
  selected: {
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: Colors.mainColor,
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
  w150: {
    width: 150,
  },
  video: {
    flex: 1,
  },
  lifetimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    position: "relative",
  },
  slider: {
    width: 250,
    height: 40,
  },
  sliderTitles: {
    position: "absolute",
    width: 230,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: -5,
    left: 75,
  },
  sliderTitle: {
    fontFamily: "ubuntu",
    color: "white",
  },
});
