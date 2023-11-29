import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

import { Colors } from "../../utils/colors";
import CustomAvatar from "../ui/avatar";

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

  return (
    <Marker
      style={styles.marker}
      zIndex={zIndex}
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
        <CustomAvatar size={size - borderWidth} photo={photo} />
      </View>
    </Marker>
  );
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
  },
});
