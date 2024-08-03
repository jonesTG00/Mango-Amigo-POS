import { Text, View, StyleSheet, ImageBackground } from "react-native";

import * as React from "react";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useFonts } from "expo-font";

import defaultStyles from "../assets/defaults";

export default function Receipt() {
  const [fonts] = useFonts({
    Monument: require("../assets/fonts/Monument Extended.otf"),
  });

  const style = StyleSheet.create({
    container: {
      height: "100%",
      width: "40%",
      backgroundColor: "#f1f1f1",
      display: "flex",
      alignItems: "center",
      padding: wp(3),
    },
  });

  if (!fonts) {
    return <Text>Wait</Text>;
  }
  return (
    <View style={[style.container, defaultStyles.big_shadow]}>
      <Text
        style={{
          fontFamily: "Monument",
          fontSize: hp(7),
          color: "black",
        }}
      >
        Receipt
      </Text>
    </View>
  );
}
