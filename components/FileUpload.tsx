import { Text, TouchableOpacity, View, Image } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function FileUpload() {
  const [image, setImage] = useState<ImagePicker.ImagePickerSuccessResult>();
  const [uri, setURI] = useState<string>("");
  async function captureImage() {
    const permission = await ImagePicker.getCameraPermissionsAsync();
    if (permission.granted) {
      console.log("granted");
      let result = await ImagePicker.launchCameraAsync({
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        cameraType: ImagePicker.CameraType.front,
      });

      if (!result.canceled) {
        setImage(result);
        console.log("image obj");
        console.log(image);
        setURI(result.assets[0].uri);
        console.log("uri");
        console.log(uri);
      }
    } else {
      console.log("not granted");
      await ImagePicker.requestCameraPermissionsAsync();
      captureImage();
    }
  }

  //     function loadData(){
  //       if (uri !== "") {
  //           return (
  //   <Image source={{uri}}></Image>
  //           )
  //       }
  //     }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: hp(1),
      }}
    >
      <TouchableOpacity onPress={captureImage}>
        <Text>Jones</Text>
      </TouchableOpacity>
      {uri !== "" ? (
        <Image source={{ uri: uri }} width={100} height={100} />
      ) : (
        <Text>wala pa picture</Text>
      )}
    </View>
  );
}
