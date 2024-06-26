import { Entypo } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { View, Pressable, FlatList, Alert } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import styles from "./styles";
import Map from "../../components/moments/map";
import CustomMarker from "../../components/moments/marker";
import VideoList from "../../components/moments/videoList";
import VideoPreview from "../../components/moments/videoPreview";
import CustomSwitcher from "../../components/ui/switcher";
import CustomText from "../../components/ui/text";
import { Colors } from "../../utils/colors";
import { getNearVideos } from "../../utils/db";

const MIN_RADIUS = 500;
const MAX_RADIUS = 6000;

function Moments() {
  const insets = useSafeAreaInsets();
  const myUid = useSelector((state) => state.auth.uid);
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
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [mapZoom, setMapZoom] = useState(5);

  const [newRegion, setNewRegion] = useState();

  // const delta = radius / MIN_RADIUS / 100;

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
      Alert.alert(t("moments.location_error"));
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

  function onOpenProfile(uid) {
    if (uid === myUid) navigation.navigate("MyProfile");
    else navigation.navigate("UserProfile", { uid });
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

  function onRadiusChange(value) {
    setRadius(value);
  }

  function onMapMove(region) {
    const { latitudeDelta } = region;
    let zoom = 30 - Math.round(latitudeDelta * 1000);
    if (zoom <= 0) zoom = 1;
    setMapZoom(zoom);

    setNewRegion(region);
  }

  const mapMarkers = videos.map((video) => (
    <CustomMarker
      key={video.id}
      selected={video.id === selectedVideo}
      {...video}
      mapZoom={mapZoom}
      onPress={showPreview}
    />
  ));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {video && (
        <VideoPreview
          {...video}
          onClosePreview={onClosePreview}
          onLike={onLike}
          onDislike={onDislike}
          onOpenProfile={onOpenProfile}
        />
      )}
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        style={styles.locationSwitch}
        buttons={[
          {
            value: "world",
            label: t("moments.world_btn_label"),
            icon: "earth",
            checkedColor: "white",
            uncheckedColor: "grey",
          },
          {
            value: "local",
            label: t("moments.local_btn_label"),
            icon: "crosshairs-gps",
            checkedColor: "white",
            uncheckedColor: "grey",
          },
        ]}
      />
      <View style={[styles.switcherRow, { top: insets.top + 60 }]}>
        <CustomText style={styles.switcherText}>
          {t("moments.only_following")}
        </CustomText>
        <CustomSwitcher
          value={onlyFollowing}
          onToggle={() => {
            setOnlyFollowing((prevState) => !prevState);
          }}
        />
      </View>
      <View style={styles.mapContainer}>
        <Map
          location={myLocation}
          circleRadius={radius}
          // delta={latitudeDelta}
          newRegion={newRegion}
          onMapMove={onMapMove}
          markers={mapMarkers}
        />
      </View>
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
        onValueChange={onRadiusChange}
      />
      <View style={styles.sorting}>
        <Pressable style={styles.sortingRow} onPress={() => onSort("time")}>
          <CustomText style={styles.sortingText}>
            {t("moments.sort_by_time")}
          </CustomText>
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
          <CustomText style={styles.sortingText}>
            {t("moments.sort_by_popularity")}
          </CustomText>
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
