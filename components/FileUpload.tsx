import { Text, TouchableOpacity, View, Image, Alert } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import defaults from "../assets/defaults";

interface FileUploadDetails {
  uri: string;
  setURI: (item: string) => void;
}

export default function FileUpload(props: FileUploadDetails) {
  const { uri, setURI } = props;
  const [image, setImage] = useState<ImagePicker.ImagePickerSuccessResult>();

  async function captureImage() {
    const permission = await ImagePicker.getCameraPermissionsAsync();
    if (permission.status === ImagePicker.PermissionStatus.UNDETERMINED) {
      await ImagePicker.requestCameraPermissionsAsync();
    } else if (permission.status === ImagePicker.PermissionStatus.DENIED) {
      Alert.alert("Allow camera permissions needed in settings to use this.");
    } else {
      console.log("granted");
      let result = await ImagePicker.launchCameraAsync({
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        cameraType: ImagePicker.CameraType.front,
        aspect: [4, 5],
      });

      if (!result.canceled) {
        setImage(result);
        console.log("image obj");
        console.log(image);
        setURI(result.assets[0].uri);
        console.log("uri");
        console.log(uri);
      }
    }
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: hp(1),
        padding: hp(0.5),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {uri !== "" ? (
        <Image source={{ uri: uri }} width={100} height={100} />
      ) : (
        <View style={{ width: hp(2), height: hp(3) }} />
      )}

      <TouchableOpacity
        onPress={captureImage}
        style={[defaults.small_shadow, { padding: hp(0.5) }]}
      >
        <Text>{uri === "" ? "Capture Image" : "Replace Image"}</Text>
      </TouchableOpacity>
    </View>
  );
}
