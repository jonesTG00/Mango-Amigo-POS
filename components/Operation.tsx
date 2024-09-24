import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { images } from "../assets/db/types";

interface OperationDetails {
  operation_name: string;
  icon_source: string;
  onPress: () => void;
}

export default function Operation(props: OperationDetails) {
  const { operation_name, icon_source } = props;

  const styles = StyleSheet.create({
    container: {
      width: hp(6),
      height: hp(6),
      display: "flex",
      flexDirection: "column",
      gap: hp(0.5),
      alignItems: "center",
    },
    button: {
      width: "100%",
      height: "90%",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={props.onPress}>
        <Image
          source={images[props.icon_source as keyof typeof images]}
          style={{ flex: 1, resizeMode: "cover", width: "100%" }}
        ></Image>
      </TouchableOpacity>
      <Text style={{ fontFamily: "Poppins", fontSize: hp(1) }}>
        {operation_name}
      </Text>
    </View>
  );
}
