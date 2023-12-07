import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Platform } from "react-native";
// import { Marker } from "react-native-maps";
import { Marker as MarkerOS } from "react-native-maps-osmdroid";

import { Colors } from "../../utils/colors";

function CustomMarker(props) {
  const { id, photo, likes, dislikes, location, selected, mapZoom, onPress } =
    props;

  const videoPopularity =
    Math.max(
      Math.round(((likes - dislikes) / (likes + dislikes)) * 100) || 0,
      0,
    ) / 2;

  const size = 20 + videoPopularity;
  const borderColor = Colors.bgColor;
  const borderWidth = 2;
  const zIndex = selected ? 100 : 1;

  const hidden = !selected && size + mapZoom * 2 < 75;

  let marker = null;

  if (Platform.OS === "android") {
    marker = (
      <MarkerOS
        key={id}
        style={[styles.marker, { zIndex }]}
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        onPress={() => onPress(id)}
      >
        <View
          style={[
            styles.avatar,
            {
              borderColor,
              borderWidth,
              width: size + borderWidth,
              height: size + borderWidth,
              zIndex,
            },
            selected ? styles.selected : null,
            hidden ? styles.hidden : null,
          ]}
        >
          {photo !== "" ? (
            <Image style={styles.photo} source={photo} contentFit="cover" />
          ) : (
            <FontAwesome name="user" size={size} color="black" />
          )}
          <Text style={styles.hackTextForUpdate}>
            {selected || hidden ? "." : ".."}
          </Text>
        </View>
      </MarkerOS>
    );
  } else {
    // marker = (
    //   <Marker
    //     style={styles.marker}
    //     zIndex={zIndex}
    //     coordinate={{
    //       latitude: location.latitude,
    //       longitude: location.longitude,
    //     }}
    //     onPress={() => onPress(id)}
    //   >
    //     <View
    //       style={[
    //         styles.avatar,
    //         {
    //           borderColor,
    //           borderWidth,
    //           width: size + borderWidth,
    //           height: size + borderWidth,
    //           zIndex,
    //         },
    //         selected ? styles.selected : null,
    //         hidden ? styles.hidden : null,
    //       ]}
    //     >
    //       <CustomAvatar size={size - borderWidth} photo={photo} />
    //     </View>
    //   </Marker>
    // );
  }

  return marker;
}

export default CustomMarker;

const styles = StyleSheet.create({
  marker: {
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    borderColor: "green",
    zIndex: 100,
  },
  hidden: {
    opacity: 0,
  },
  avatar: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#0553",
  },
  hackTextForUpdate: {
    position: "absolute",
    opacity: 0,
  },
  photo: {
    flex: 1,
    width: "100%",
  },
});
