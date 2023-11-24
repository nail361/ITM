import { Entypo } from "@expo/vector-icons";
import { Video as VideoPlayer, ResizeMode } from "expo-av";
import { Image } from "expo-image";
import { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";

import { Colors } from "../../utils/colors";
import Loading from "../ui/loading";
import CustomText from "../ui/text";

const screenWidth = Dimensions.get("window").width;

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Preview(props) {
  const { preview, myProfile, onVideoClose, onVideoRemove } = props;
  const [videoLoading, setVideoLoading] = useState(true);
  const [mapIndex, setMapIndex] = useState(0);
  const [mapImages, setMapImages] = useState([]);
  const videoPlayer = useRef(null);

  useEffect(() => {
    getMap();
  }, [preview.videoUrl]);

  useEffect(() => {
    const myInterval = setInterval(() => {
      setMapIndex((prevIndex) => {
        if (prevIndex >= mapImages.length - 1) return 0;
        else return ++prevIndex;
      });
    }, 3000);

    return () => clearInterval(myInterval);
  }, []);

  function videoLoaded() {
    setVideoLoading(false);
    videoPlayer.current.playAsync();
  }

  function getMap() {
    const mapWidth = Math.ceil(screenWidth);
    const mapHeight = Math.ceil(screenWidth / 1.8);
    const position = `${preview.location.latitude},${preview.location.longitude}`;
    const marker = `${preview.location.latitude},${preview.location.longitude}~k:c~c:be~s:l`;

    setMapImages([
      `https://static.maps.2gis.com/1.0?s=${mapWidth}x${mapHeight}&c=${position}&z=${2}&pt=${marker}`,
      `https://static.maps.2gis.com/1.0?s=${mapWidth}x${mapHeight}&c=${position}&z=${5}&pt=${marker}`,
      `https://static.maps.2gis.com/1.0?s=${mapWidth}x${mapHeight}&c=${position}&z=${10}&pt=${marker}`,
      `https://static.maps.2gis.com/1.0?s=${mapWidth}x${mapHeight}&c=${position}&z=${15}&pt=${marker}`,
    ]);
  }

  return (
    <>
      <View style={styles.map}>
        <Image
          style={styles.mapImage}
          source={mapImages[mapIndex] || ""}
          placeholder={blurhash}
          contentFit="contain"
          transition={800}
        />
      </View>
      <Pressable style={styles.container} onPress={onVideoClose}>
        {myProfile && !videoLoading && (
          <>
            <View style={styles.privacy}>
              <Entypo
                name={preview.privacy === "private" ? "lock" : "lock-open"}
                size={20}
                color="white"
              />
              <CustomText style={styles.privacyText}>
                {preview.privacy}
              </CustomText>
            </View>

            <Pressable
              style={styles.removeBtn}
              onPress={() => onVideoRemove(preview.id)}
            >
              <Entypo name="cup" size={25} color="white" />
            </Pressable>
          </>
        )}
        {!myProfile && !videoLoading && (
          <>
            <Pressable>
              <Entypo name="thumbs-up" size={16} color="white" />
              <CustomText style={styles.likeText}>{preview.likes}</CustomText>
            </Pressable>
            <Pressable>
              <Entypo name="thumbs-down" size={16} color="white" />
              <CustomText style={styles.dislikeText}>
                {preview.dislikes}
              </CustomText>
            </Pressable>
          </>
        )}
        <VideoPlayer
          ref={videoPlayer}
          style={styles.videoPreview}
          source={{
            uri: preview.videoUrl,
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onLoad={videoLoaded}
        />
        {videoLoading && <Loading style={styles.videoLoading} />}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "70%",
    backgroundColor: Colors.bgColor,
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
  removeBtn: {
    position: "absolute",
    bottom: 15,
    right: 25,
    zIndex: 2,
    backgroundColor: Colors.mainColor,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  privacy: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    top: 15,
    right: 25,
    zIndex: 2,
  },
  privacyText: {
    color: "white",
  },
  map: {
    width: "100%",
    height: "30%",
    padding: 20,
    backgroundColor: Colors.bgColor,
  },
  mapImage: {
    height: "100%",
  },
});
