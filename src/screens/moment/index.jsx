import { useIsFocused } from "@react-navigation/core";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { Text, Animated, View, LayoutAnimation } from "react-native";
import styles from "./styles";

// import ProgressBar from "../components/ProgressBar";
import CameraOverlay from "../../components/moment/Overlay";
// import Preview from "../components/Preview";

const VIDEO_MAX_DURATION = 60000;

function Moment() {
  const camera = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [galleryItems, setGalleryItems] = useState([]);
  const [videoIsLoading, setVideoIsLoading] = useState(false);
  const [progress, setProgress] = useState(VIDEO_MAX_DURATION / 1000);
  const [cameraDirection, setCameraDirection] = useState(CameraType.back);
  const [cameraFlash, setCameraFlash] = useState(
    Camera.Constants.FlashMode.off,
  );
  const [isCameraReady, setCameraReady] = useState(false);

  const [cameraPermission, setCameraPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");

      const audioStatus = await Audio.requestPermissionsAsync();
      setAudioPermission(audioStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === "granted");

      if (galleryStatus.status === "granted") {
        const userGalleryMedia = await MediaLibrary.getAssetsAsync({
          sortBy: ["creationTime"],
          mediaType: ["video"],
        });
        setGalleryItems(userGalleryMedia.assets);
      }
    })();
  }, []);

  if (!cameraPermission || !audioPermission || !galleryPermission) {
    return (
      <View>
        <Text></Text>
      </View>
    );
  }

  const progressAnimation = new Animated.Value(0);

  const progressTranslateX = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-200%", "0%"],
  });

  const progressFlex = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const progressBackgroundColor = progressAnimation.interpolate({
    inputRange: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: [
      "#ff470f",
      "#ff3860",
      "#b86bff",
      "#2196f3",
      "#b86bff",
      "#ff7600",
      "#3273dc",
      "red",
      "#FF5F14",
    ],
  });

  const onPlaybackStatusUpdate = async (status) => {
    /*
    // THIS FUNCTION DOESN'T ACTUALLY DO ANYTHING RIGHT NOW.
    // I tried messing around with it to manually loop the video and see if that would fix it, but no luck...
    
      // console.log('\n\n\n', status, '\n\n\n');
    if (status.didJustFinish && !status.isLooping && !status.isPlaying) {
      if (video) {
        console.log('video should loop now...');
        if (!recordingWasManuallyCancelled) {
          // For some reason, if you manually trigger this.video.stopRecording(),
          // then looping faces a bug after the first playback, where it just freezes indefinitely.
          // However, if the video gets canceled on its own with the time running out from
          // maxDuration: 4, then there's no issue  with looping after the first playback.
          // Thus, we check if the user cancelled the recording or if it happened on its own.
          // this.video.setIsLoopingAsync(true);
        }
        // await this.video.setIsLoopingAsync(true);
        // console.log('set to loop...');
        await video.replayAsync();
        console.log('was replayed...');
      }
    }*/
  };

  const onToggleRecord = async () => {
    if (camera.current) {
      if (!isRecording) {
        try {
          const options = {
            maxDuration: VIDEO_MAX_DURATION / 1000,
            quality: Camera.Constants.VideoQuality["480"],
          };

          const videoRecordPromise = camera.current.recordAsync(options);
          if (videoRecordPromise) {
            setIsRecording(true);
            const data = await videoRecordPromise;
            const source = data.uri;
          }

          // animateProgressBar();
          // startCountdown();
          // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        } catch (error) {
          console.warn(error);
        }
      } else {
        camera.current.stopRecording();
        setIsRecording(false);
      }
    }
  };

  const onGalleryPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      // TODO:  pass video uri into save component
    }
  };

  const cancelMedia = () => {
    // setVideo(null);
  };

  const handleVideoPlayerRef = (ref) => {
    // this.video = ref;
    // if (this.video) {
    // }
  };
  /*
  handleRecordButtonRef(ref) {
    this.recordButton = ref;
  }
  updateProgressText(progressText) {
    this.setState({ progressText });
  }
  startCountdown() {
    const endDate = Date.now() + VIDEO_DURATION;
    this.setState({ progressText: VIDEO_DURATION / 1000 }, () => countdown(endDate, this.updateProgressText));
  }
  animateProgressBar() {
    this.progressAnimation.setValue(0);
    Animated.timing(this.progressAnimation, {
      toValue: 1,
      useNativeDriver: false,
      easing: Easing.linear,
      duration: VIDEO_DURATION
    }).start();
  }
  animationStyle() {
    const { progressFlex: flex, progressBackgroundColor: backgroundColor } = this;
    return {
      flex,
      // transform: [
      //   { translateX }
      // ],
      backgroundColor
    }
  }
*/
  const toggleCameraType = () => {
    setCameraDirection((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  };

  if (!isFocused) return null;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraDirection}
        flashMode={cameraFlash}
        onCameraReady={() => setCameraReady(true)}
        ref={camera}
        ratio={"16:9"}
      />
      {/* <ProgressBar
        video={video}
        isRecording={isRecording}
        animationStyle={this.animationStyle()}
        progressText={progressText}
        cancelMedia={this.cancelMedia}
        videoIsLoading={videoIsLoading}
      /> */}
      {isCameraReady && (
        <CameraOverlay
          onToggleRecord={onToggleRecord}
          onGalleryPress={onGalleryPress}
          video={video}
          isRecording={isRecording}
          gallery={galleryItems}
        />
      )}
      {/* <Preview
        video={video}
        handleVideoRef={this.handleVideoPlayerRef}
        onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
      /> */}
    </View>
  );
}

export default Moment;
