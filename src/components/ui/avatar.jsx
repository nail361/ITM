import { Avatar } from "react-native-paper";

export default function CustomAvatar(props) {
  const { photo, size } = props;

  return (
    <>
      {photo ? (
        <Avatar.Image size={size} source={{ uri: photo }} />
      ) : (
        <Avatar.Icon size={size} icon={"account"} />
      )}
    </>
  );
}
