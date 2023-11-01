import { useIsFocused } from "@react-navigation/core";
import { Audio } from "expo-av";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useState, useRef, useEffect } from "react";
import { Text, View } from "react-native";

import styles from "./styles";
import CameraOverlay from "../../components/moment/Overlay";
import SaveVideo from "../../components/moment/SaveVideo";
import ProgressBar from "../../components/moment/ProgressBar";

const VIDEO_MAX_DURATION = 60; //sec

function Moment() {
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
            setVideo(source);
          }
        } catch (error) {
          console.warn(error);
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
    <View style={styles.container}>
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
