import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Vibration,
} from "react-native";
import { useFonts } from "expo-font";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import defaultStyles, { MENU_CATEGORY_NAME } from "../assets/defaults";
import { useEffect, useState } from "react";
import MenuModal from "./MenuModal";
import menuJson from "../assets/db/menuItems.json";
import { AddOnReceipt, Receipt } from "../assets/db/types";
import { useSQLiteContext } from "expo-sqlite";

interface MenuDetails {
  menu_category_name: string;
  bg_color: string;
}

export default function MenuButton(props: MenuDetails) {
  const { menu_category_name, bg_color } = props;

  const [clicked, setClick] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [fonts] = useFonts({
    Boogaloo: require("../assets/fonts/Boogaloo.ttf"),
    Monument: require("../assets/fonts/Monument Extended.otf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
  });

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: bg_color,
      height: "auto",
      width: "100%",
      paddingHorizontal: hp(1),
      paddingVertical: hp(2),
    },
    menuName: {
      fontFamily: "Poppins",
      fontSize: hp(1.5),
      color: "#050301",
    },
  });

  if (!fonts) {
    return <Text>wait</Text>;
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        clicked
          ? defaultStyles.small_shadow_clicked
          : defaultStyles.small_shadow,
      ]}
      activeOpacity={1}
      onPressIn={() => {
        setClick(true);
        Vibration.vibrate(500);
      }}
      onPressOut={() => {
        setClick(false);
        setModal(true);
      }}
    >
      <Text style={styles.menuName}>{menu_category_name}</Text>
      <Text style={styles.menuName}>&gt;</Text>
      {
        <MenuModal
          onClose={() => setModal(false)}
          menu_category_name={menu_category_name}
          isVisible={modal}
          color={bg_color}
        />
      }
    </TouchableOpacity>
  );
}
