import { useRef, useState } as React from 'react';
import { View, StyleSheet, Button } from "react-native";
import { Video, ResizeMode } from 'expo-av';

function Preview(props: any) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const {
    video,
    onReadyForDisplay,
    onLoad,
    onLoadStart,
    handleVideoRef,
    onPlaybackStatusUpdate,
  } = props;

  if (video && video.uri) {
    return (
      <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
    </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  buttons: {

  },
  video: {
    flex: 1,
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
});

export default Preview;
