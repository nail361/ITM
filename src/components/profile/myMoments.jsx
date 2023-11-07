import { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";

import { getMyVideos } from "../../utils/firebase";
import Loading from "../ui/loading";
import CustomText from "../ui/text";

import { Entypo } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";

function Video(props) {
  const { thumbnail, createAt, lifetime, likes, dislikes } = props.data;

  return (
    <View style={styles.video}>
      <Image style={styles.thumbnail} source={{ uri: thumbnail }} />
      <View style={styles.likes}>
        <View style={styles.likeRow}>
          <Entypo name="thumbs-up" size={16} color="green" />
          <CustomText style={styles.likeText}>{likes}</CustomText>
        </View>
        <View style={styles.likeRow}>
          <Entypo name="thumbs-down" size={16} color="red" />
          <CustomText style={styles.dislikeText}>{likes}</CustomText>
        </View>
      </View>
    </View>
  );
}

export default function MyMoments() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      const response = await getMyVideos();
      setVideos(response);
      setLoading(false);
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.videos}
        numColumns={3}
        removeClippedSubviews
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Video data={item} />}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videos: {
    flex: 1,
    paddingHorizontal: 20,
  },
  video: {
    flex: 1 / 3,
    width: 100,
    height: 100,
    backgroundColor: "grey",
    marginHorizontal: 5,
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.mainColor,
  },
  thumbnail: {
    flex: 1,
  },
  likes: {
    position: "absolute",
    bottom: 8,
    left: 5,
    flexDirection: "column",
    height: 40,
    justifyContent: "space-between",
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
  dislikeText: {
    fontSize: 16,
    color: "red",
    marginLeft: 5,
  },
  likeText: {
    fontSize: 16,
    color: "green",
    marginLeft: 5,
  },
});
