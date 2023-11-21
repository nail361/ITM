import { Entypo } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Video as VideoPlayer, ResizeMode } from "expo-av";
import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { View, Pressable, FlatList, Alert } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { SegmentedButtons } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import styles from "./styles";
import CustomMarker from "../../components/moments/marker";
import VideoList from "../../components/moments/videoList";
import VideoPreview from "../../components/moments/videoPreview";
import Loading from "../../components/ui/loading";
import CustomSwitcher from "../../components/ui/switcher";
import CustomText from "../../components/ui/text";
import { Colors } from "../../utils/colors";
import { getNearVideos } from "../../utils/db";

const MIN_RADIUS = 500;
const MAX_RADIUS = 6000;

function Moments() {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState("local");
  const [radius, setRadius] = useState(500); //in meters
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [myLocation, setMyLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [onlyFollowing, setOnlyFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState("time");
  const [sortDirection, setSotrDirection] = useState(1);
  const [t] = useTranslation();

  const delta = radius / MIN_RADIUS / 100;

  const orderedVideos = videos.sort((a, b) => {
    let sort = 0;
    if (sorting === "likes") {
      sort = a.likes - a.dislikes > b.likes - b.dislikes ? 1 : -1;
    } else if (sorting === "time") {
      sort =
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
          ? 1
          : -1;
    }

    return sort * sortDirection;
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    let location = null;
    try {
      location = await Location.getLastKnownPositionAsync();
      if (location == null) location = await Location.getCurrentPositionAsync();
    } catch (error) {
      Alert.alert("Приложение не может работать с выключеной геолокацией");
    }

    const locationObj = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setMyLocation(locationObj);

    const response = await getNearVideos(locationObj, radius / 1000);
    setVideos(response);
    setLoading(false);
  }

  function onChangeRadiusComplete() {
    // fetchVideos();
  }

  function onSelectVideo(videoId) {
    if (selectedVideo === videoId) showPreview(videoId);
    else setSelectedVideo(videoId);
  }

  function showPreview(videoId) {
    const videoObj = videos.find((vid) => vid.id === videoId);
    setVideo(videoObj);
  }

  function onClosePreview() {
    setSelectedVideo("");
    setVideo(null);
  }

  function onLike(id) {
    console.log(id);
  }

  function onDislike(id) {
    console.log(id);
  }

  function onSort(sort) {
    setSorting(sort);
    setSotrDirection((prevState) => prevState * -1);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {video && (
        <VideoPreview
          {...video}
          onClosePreview={onClosePreview}
          onLike={onLike}
          onDislike={onDislike}
        />
      )}
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        style={styles.locationSwitch}
        buttons={[
          {
            value: "world",
            label: "WORLD",
            icon: "earth",
            checkedColor: "white",
            uncheckedColor: "grey",
          },
          {
            value: "local",
            label: "LOCAL",
            icon: "crosshairs-gps",
            checkedColor: "white",
            uncheckedColor: "grey",
          },
        ]}
      />
      <View style={[styles.switcherRow, { top: insets.top + 50 }]}>
        <CustomText style={styles.switcherText}>подписки</CustomText>
        <CustomSwitcher
          value={onlyFollowing}
          onToggle={() => {
            setOnlyFollowing((prevState) => !prevState);
          }}
        />
      </View>
      <MapView
        style={styles.map}
        showsUserLocation={false}
        minZoomLevel={11}
        maxZoomLevel={20}
        showsPointsOfInterest={false}
        // showsBuildings={false}
        pitchEnabled={false}
        zoomTapEnabled={false}
        // zoomControlEnabled={false}
        rotateEnabled={false}
        // scrollEnabled={false}
        showsCompass={false}
        initialRegion={{
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        }}
        region={{
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        }}
      >
        <Circle
          center={{
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
          }}
          radius={radius}
          strokeColor="#55555550"
          fillColor="#0000ff20"
        />
        {videos.map((video) => (
          <CustomMarker
            key={video.id}
            selected={video.id === selectedVideo}
            {...video}
            onPress={showPreview}
          />
        ))}
      </MapView>
      <Slider
        style={styles.radiusSlider}
        minimumValue={MIN_RADIUS}
        maximumValue={MAX_RADIUS}
        step={500}
        value={radius}
        minimumTrackTintColor={Colors.mainColor}
        maximumTrackTintColor={Colors.lightTextColor}
        thumbTintColor={Colors.mainColor}
        onSlidingComplete={onChangeRadiusComplete}
        onValueChange={(value) => setRadius(value)}
      />
      <View style={styles.sorting}>
        <Pressable style={styles.sortingRow} onPress={() => onSort("time")}>
          <CustomText style={styles.sortingText}>время</CustomText>
          {sorting === "time" && (
            <Entypo
              style={styles.sortingDirection}
              name={sortDirection === 1 ? "arrow-long-down" : "arrow-long-up"}
              size={12}
              color="white"
            />
          )}
        </Pressable>
        <Pressable style={styles.sortingRow} onPress={() => onSort("likes")}>
          <CustomText style={styles.sortingText}>популярность</CustomText>
          {sorting === "likes" && (
            <Entypo
              style={styles.sortingDirection}
              name={sortDirection === 1 ? "arrow-long-down" : "arrow-long-up"}
              size={12}
              color="white"
            />
          )}
        </Pressable>
      </View>
      <FlatList
        refreshing={loading}
        onRefresh={fetchVideos}
        style={styles.videoList}
        numColumns={1}
        data={orderedVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoList
            {...item}
            selected={item.id === selectedVideo}
            onPress={onSelectVideo}
          />
        )}
      />
    </View>
  );
}

export default Moments;
