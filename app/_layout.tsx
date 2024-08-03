import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";

import * as React from "react";
import MenuButton from "../components/MenuCategoryButton";
import * as Orientation from "expo-screen-orientation";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useFonts } from "expo-font";

import defaultStyles, { MENU_CATEGORY_NAME } from "../assets/defaults";
import Receipt from "../components/Receipt";

export default function App() {
  const [fonts] = useFonts({
    Monument: require("../assets/fonts/Monument Extended.otf"),
  });
  Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE);

  const style = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: hp(2),
      height: "100%",
      gap: hp(1),
    },
    menuDiv: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
      width: "60%",
      padding: hp(2),
      flexWrap: "wrap",
      gap: hp(1),
      backgroundColor: "#ffffff",
      opacity: 0.95,
    },
    menuButtonContainer: {
      display: "flex",
      width: "50%",
      paddingRight: hp(1),
      gap: hp(1),
      height: "100%",
      borderRightColor: "black",
      borderRightWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
    },
  });

  // const defaultMenu = [
  //   {
  //     category: MENU_CATEGORY_NAME.OUNCED_DRINKS,
  //     bg_color: "#FFB22C",
  //   },
  //   {
  //     category: MENU_CATEGORY_NAME.SIZED_DRINKS,
  //     bg_color: "#FF4C4C",
  //   },
  //   {
  //     category: MENU_CATEGORY_NAME.FRIES,
  //     bg_color: "#9A9DDD",
  //   },
  //   {
  //     category: MENU_CATEGORY_NAME.CHEESESTICK,
  //     bg_color: "#FFB22C",
  //   },
  //   {
  //     category: MENU_CATEGORY_NAME.SNACK_WITH_DRINK,
  //     bg_color: "#FF4C4C",
  //   },
  //   {
  //     category: MENU_CATEGORY_NAME.SIOMAI,
  //     bg_color: "#9A9DDD",
  //   },
  //   {
  //     category: MENU_CATEGORY_NAME.SUPER_MEAL,
  //     bg_color: "#FFB22C",
  //   },
  // ];

  const defaultMenu = [
    {
      category: MENU_CATEGORY_NAME.DRINKS,
      bg_color: "#FFB22C",
    },
    {
      category: MENU_CATEGORY_NAME.FRIES_AND_CHEESESTICK,
      bg_color: "#FF4C4C",
    },
    {
      category: MENU_CATEGORY_NAME.SIOMAI_AND_SUPERMEAL,
      bg_color: "#9A9DDD",
    },
    {
      category: MENU_CATEGORY_NAME.OTHERS,
      bg_color: "#FADDE1",
    },
  ];

  if (!fonts) {
    return <Text>Wait</Text>;
  }
  return (
    <SafeAreaView>
      <ImageBackground source={require("../assets/img/mango-pattern.jpg")}>
        <View style={style.container}>
          <Receipt />
          <View style={[style.menuDiv, defaultStyles.big_shadow]}>
            <View style={style.menuButtonContainer}>
              <Text style={{ fontFamily: "Monument", fontSize: hp(4) }}>
                Menu
              </Text>
              {defaultMenu.map((el, index) => {
                return (
                  <MenuButton
                    menu_category_name={el.category}
                    bg_color={el.bg_color}
                    key={index}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
