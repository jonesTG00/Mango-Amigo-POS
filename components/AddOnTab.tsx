import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AddOn } from "../assets/db/types";
import defaults from "../assets/defaults";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useFonts } from "expo-font";

interface AddOnTabDetails {
  add_ons: { [key: string]: number | undefined }[] | [];
  onClick: (nth: number) => void;
}
export default function AddOnTab(props: AddOnTabDetails) {
  const { add_ons, onClick } = props;

  const [fonts] = useFonts({
    Boogaloo: require("../assets/fonts/Boogaloo.ttf"),
    Monument: require("../assets/fonts/Monument Extended.otf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
  });

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      height: "100%",
      backgroundColor: "white",
      alignItems: "center",
      paddingHorizontal: hp(1),
      paddingVertical: hp(0.5),
      gap: hp(1),
    },
    add_on_button: {
      width: "100%",
      paddingHorizontal: hp(0.5),
      paddingVertical: hp(1),
    },
    text_style: {
      fontSize: hp(1),
      fontFamily: "Monument",
      textAlign: "center",
    },
  });
  return (
    <View style={[styles.container, defaults.small_shadow]}>
      {add_ons.map((el, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onClick(index);
            }}
            style={[styles.add_on_button, defaults.small_shadow]}
          >
            <Text style={[styles.text_style]}>{Object.keys(el)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
