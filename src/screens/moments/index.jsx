import Slider from "@react-native-community/slider";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Pressable } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SegmentedButtons } from "react-native-paper";

import styles from "./styles";
import Loading from "../../components/ui/loading";
import { getNearVideos } from "../../utils/db";
import { Colors } from "../../utils/colors";

function CustomMarker(props) {
  return <View style={styles.marker}></View>;
}

const MIN_RADIUS = 500;
const MAX_RADIUS = 6000;

function Moments() {
  const [type, setType] = useState("local");
  const [radius, setRadius] = useState(500); //in meters
  const [videos, setVideos] = useState([]);
  const [myLocation, setMyLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [distance, setDistance] = useState(5);
  const [onlyFirends, setOnlyFriends] = useState(false);
  const [loading, setLoading] = useState(false);
  const [t] = useTranslation();

  const delta = radius / MIN_RADIUS / 100;

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    let location = await Location.getLastKnownPositionAsync();
    if (location == null) location = await Location.getCurrentPositionAsync();

    const locationObj = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setMyLocation(locationObj);

    const response = await getNearVideos(
      locationObj,
      radius / 1000,
      onlyFirends,
    );
    setVideos(response);
    setLoading(false);
  }

  function onChangeRadiusComplete() {
    // fetchVideos();
  }

  function onVideoPress(videoId) {
    console.log(videoId);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          {
            value: "world",
            label: "WORLD",
          },
          {
            value: "local",
            label: "LOCAL",
          },
        ]}
      />
      <MapView
        style={styles.map}
        showsUserLocation={false}
        minZoomLevel={11}
        maxZoomLevel={20}
        showsPointsOfInterest={false}
        // showsBuildings={false}
        // pitchEnabled={false}
        // zoomTapEnabled={false}
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
          <Marker
            key={video.id}
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            onPress={() => onVideoPress(video.id)}
          >
            <CustomMarker {...video} />
          </Marker>
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
    </View>
  );
}

export default Moments;
