import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import CustomAvatar from "../ui/avatar";

function CustomMarker(props) {
  const { id, photo, location, selected, onPress } = props;

  const size = 50;
  const borderColor = "red";
  const borderWidth = 2;
  const zIndex = selected ? 100 : 1;

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
  avatar: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
