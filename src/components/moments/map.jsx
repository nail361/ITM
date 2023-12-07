import { useRef, useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
// import MapView, { Circle, UrlTile } from "react-native-maps";
import MapViewOS, {
  PROVIDER_OSMDROID,
  Circle as CircleOS,
} from "react-native-maps-osmdroid";

export default function Map(props) {
  const { location, circleRadius, region, markers, onMapMove } = props;

  const mapRef = useRef(null);

  // useEffect(() => {
  //   if (mapRef) {
  //     updateMap();
  //   }
  // }, [circleRadius]);

  // async function updateMap() {
  //   console.log(mapRef.current);
  //   mapRef.current.animateToRegion(region, 1000);
  // }

  let map = null;

  if (Platform.OS === "android") {
    map = (
      <MapViewOS
        ref={mapRef}
        provider={PROVIDER_OSMDROID}
        style={styles.map}
        showsUserLocation={false}
        minZoomLevel={11}
        maxZoomLevel={20}
        showsPointsOfInterest={false}
        pitchEnabled={false}
        zoomTapEnabled={false}
        rotateEnabled={false}
        showsCompass={false}
        scrollEnabled={true}
        zoomEnabled={true}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        // region={{
        //   latitude: location.latitude,
        //   longitude: location.longitude,
        //   latitudeDelta: delta,
        //   longitudeDelta: delta,
        // }}
        onRegionChangeComplete={onMapMove}
      >
        {markers}
        <CircleOS
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          radius={circleRadius}
          strokeColor="#55555550"
          fillColor="#0000ff20"
        />
      </MapViewOS>
    );
  } else {
    // map = (
    //   <MapView
    //     style={styles.map}
    //     showsUserLocation={false}
    //     minZoomLevel={11}
    //     maxZoomLevel={20}
    //     showsPointsOfInterest={false}
    //     pitchEnabled={false}
    //     zoomTapEnabled={false}
    //     rotateEnabled={false}
    //     showsCompass={false}
    //     initialRegion={{
    //       latitude: location.latitude,
    //       longitude: location.longitude,
    //       latitudeDelta: delta,
    //       longitudeDelta: delta,
    //     }}
    //     region={{
    //       latitude: location.latitude,
    //       longitude: location.longitude,
    //       latitudeDelta: delta,
    //       longitudeDelta: delta,
    //     }}
    //     onRegionChangeComplete={onMapMove}
    //   >
    //     {/* <UrlTile
    //       urlTemplate="http://tile.openstreetmap.org/{z}/{x}/{y}.png"
    //       maximumZ={19}
    //       flipY={false}
    //     /> */}
    //     <Circle
    //       center={{
    //         latitude: location.latitude,
    //         longitude: location.longitude,
    //       }}
    //       radius={circleRadius}
    //       strokeColor="#55555550"
    //       fillColor="#0000ff20"
    //     />
    //     {markers}
    //   </MapView>
    // );
  }

  return map;
}

const styles = StyleSheet.create({
  map: {
    // width: "100%",
    // height: "100%",
    // height: "50%",
    // marginTop: 10,
    ...StyleSheet.absoluteFillObject,
  },
});
