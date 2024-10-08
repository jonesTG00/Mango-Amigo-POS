import { TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import defaultStyles from "../assets/defaults";
import {
  Fries,
  Cheesestick,
  SnackWithDrink,
  Siomai,
  SuperMeal,
  DrinkData,
  OtherData,
} from "../assets/db/types";
import { useFonts } from "expo-font";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useState } from "react";

interface MenuListButtonDetails {
  menu_name: string;
  menu_data:
    | DrinkData
    | Fries
    | Cheesestick
    | SnackWithDrink
    | Siomai
    | SuperMeal
    | OtherData;
  change_item_selected: (
    data:
      | DrinkData
      | Fries
      | Cheesestick
      | SnackWithDrink
      | Siomai
      | SuperMeal
      | OtherData
  ) => void;
  buttonBackground: string;
  setButtonBackground: (item: string) => void;
  color: string;
}

export default function MenuListButton(props: MenuListButtonDetails) {
  const {
    menu_name,
    menu_data,
    change_item_selected,
    buttonBackground,
    setButtonBackground,
    color,
  } = props;

  const [fonts] = useFonts({
    Boogaloo: require("../assets/fonts/Boogaloo.ttf"),
    Monument: require("../assets/fonts/Monument Extended.otf"),
  });

  const styles = StyleSheet.create({
    button: {
      marginBottom: hp(1),
      paddingHorizontal: hp(1),
      paddingVertical: hp(2),
    },
    menu_name: {
      fontFamily: "Monument",
      fontSize: hp(1),
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.button,
        defaultStyles.small_shadow,
        buttonBackground === menu_data.menu_name
          ? { backgroundColor: color }
          : { backgroundColor: "white" },
      ]}
      activeOpacity={0.8}
      onPress={() => {
        change_item_selected(menu_data);
        setButtonBackground(menu_data.menu_name);
      }}
    >
      {/* <Image style={styles.menu_image}></Image> */}
      <Text style={[styles.menu_name]}>{menu_name}</Text>
    </TouchableOpacity>
  );
}
