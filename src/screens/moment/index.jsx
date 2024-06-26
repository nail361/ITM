import { useIsFocused } from "@react-navigation/core";
import { Audio } from "expo-av";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useState, useRef, useEffect } from "react";
import { View, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import styles from "./styles";
import CameraOverlay from "../../components/moment/Overlay";
import ProgressBar from "../../components/moment/ProgressBar";
import SaveVideo from "../../components/moment/SaveVideo";
import CustomText from "../../components/ui/text";

const VIDEO_MAX_DURATION = 60; //sec

function Moment() {
  const insets = useSafeAreaInsets();
  const camera = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [galleryItems, setGalleryItems] = useState([]);
  const [cameraDirection, setCameraDirection] = useState(CameraType.back);
  const [cameraFlash, setCameraFlash] = useState(
    Camera.Constants.FlashMode.off,
  );
  const [isCameraReady, setCameraReady] = useState(false);

  const [cameraPermission, setCameraPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState(false);

  const isFocused = useIsFocused();

  let availableVideoCodecs = [];

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

      if (Platform.OS === "ios") {
        availableVideoCodecs = await Camera.getAvailableVideoCodecsAsync();
      }
    })();
  }, []);

  if (!cameraPermission || !audioPermission || !galleryPermission) {
    return (
      <View>
        <CustomText></CustomText>
      </View>
    );
  }

  const onToggleRecord = async () => {
    if (camera.current) {
      if (!isRecording) {
        try {
          const options = {
            maxDuration: VIDEO_MAX_DURATION,
            quality: Camera.Constants.VideoQuality["480p"],
          };

          /*
          let curRatio = "16:9";
          let availableRatios = [];
          if (Platform.OS === "android") {
            availableRatios = await camera.current.getSupportedRatiosAsync();
            if (availableRatios.indexOf("16:9") == -1)
          }*/

          const videoRecordPromise = camera.current.recordAsync(options);
          if (videoRecordPromise) {
            setIsRecording(true);
            const data = await videoRecordPromise;
            const source = data.uri;
            if (source) {
              setVideo(source);
            }
          }
        } catch (error) {
          Alert.alert(error);
        }
      } else {
        stopRecording();
      }
    }
  };

  const stopRecording = () => {
    camera.current.stopRecording();
    setIsRecording(false);
  };

  const onGalleryPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  const cancelMedia = () => {
    setVideo(null);
  };

  const toggleCameraDirection = () => {
    setCameraDirection((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  };

  const toggleFlashlight = () => {
    setCameraFlash((current) =>
      current === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off,
    );
  };

  if (!isFocused) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!video && (
        <>
          <Camera
            style={styles.camera}
            type={cameraDirection}
            flashMode={cameraFlash}
            onCameraReady={() => setCameraReady(true)}
            ref={camera}
            ratio={"16:9"}
          />
          <ProgressBar
            maxDuration={VIDEO_MAX_DURATION}
            isRecording={isRecording}
            onEndEvent={stopRecording}
          />
          {isCameraReady && (
            <CameraOverlay
              onToggleRecord={onToggleRecord}
              onGalleryPress={onGalleryPress}
              isRecording={isRecording}
              gallery={galleryItems}
              onToggleCameraDirection={toggleCameraDirection}
              onToggleFlashlight={toggleFlashlight}
            />
          )}
        </>
      )}
      {video && <SaveVideo videoUri={video} cancelPublish={cancelMedia} />}
    </View>
  );
}

export default Moment;
