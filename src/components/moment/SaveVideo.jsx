import Slider from "@react-native-community/slider";
import { Video, ResizeMode } from "expo-av";
import * as Location from "expo-location";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SegmentedButtons } from "react-native-paper";

import UploadProgress from "./UploadProgress";
import { Colors } from "../../utils/colors";
import { publishVideo } from "../../utils/db";
import CustomButton from "../ui/button";
import CustomText from "../ui/text";
import CustomTextInput from "../ui/textInput";

export default function SaveVideo(props) {
  const [status, setStatus] = useState({});
  const [isUploading, setUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [videoDescription, setDesctiption] = useState("");
  const [videoPrivacy, setPrivacy] = useState("public");
  const [videoLifetime, setLifetime] = useState(30);
  const video = useRef(null);
  const { videoUri, cancelPublish } = props;
  const { t } = useTranslation();

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
        <CustomTextInput
          style={styles.description}
          maxLength={150}
          multiline
          label={t("moment.description")}
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
                label: t("moment.public_btn_label"),
                icon: "lock-open-variant-outline",
                checkedColor: "white",
                uncheckedColor: "grey",
              },
              {
                value: "private",
                label: t("moment.private_btn_label"),
                icon: "lock-outline",
                checkedColor: "white",
                uncheckedColor: "grey",
              },
            ]}
          />
        </View>
        <View style={styles.lifetimeWrapper}>
          <CustomText style={styles.lifetimeText}>
            {t("moment.lifetime")}
          </CustomText>
          <View style={styles.lifetimeSliderContainer}>
            <View style={styles.sliderTitles}>
              <CustomText style={styles.sliderTitle}>
                {t("moment.15m")}
              </CustomText>
              <CustomText style={styles.sliderTitle}>
                {t("moment.30m")}
              </CustomText>
              <CustomText style={styles.sliderTitle}>
                {t("moment.45m")}
              </CustomText>
              <CustomText style={styles.sliderTitle}>
                {t("moment.60m")}
              </CustomText>
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
      </View>
      <View style={styles.buttons}>
        <CustomButton style={styles.w150} onPress={cancelPublish}>
          {t("moment.cancel_publish")}
        </CustomButton>
        <CustomButton style={styles.w150} onPress={onPublish}>
          {t("moment.submit_publish")}
        </CustomButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.bgColor,
  },
  videoContainer: {
    flex: 1,
    paddingTop: 10,
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
  },
  privacyWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    width: "100%",
    height: 50,
    padding: 5,
    color: "black",
    verticalAlign: "top",
    backgroundColor: Colors.lightTextColor,
  },
  lifetimeText: {
    color: "white",
    fontSize: 16,
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
  lifetimeSliderContainer: {
    flexDirection: "column",
  },
  slider: {
    width: 250,
    height: 40,
  },
  sliderTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  sliderTitle: {
    color: "white",
    fontSize: 14,
  },
});
