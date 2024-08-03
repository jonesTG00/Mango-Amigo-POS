import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// export default StyleSheet.create({

// })

export default StyleSheet.create({
  big_shadow: {
    borderColor: "#050301",
    borderRightWidth: wp(1),
    borderBottomWidth: wp(1),
    borderTopWidth: wp(0.25),
    borderLeftWidth: wp(0.25),
    borderRadius: 20,
  },

  small_shadow: {
    borderRadius: 10,
    borderColor: "#050301",
    borderRightWidth: wp(0.5),
    borderBottomWidth: wp(0.5),
    borderTopWidth: wp(0.15),
    borderLeftWidth: wp(0.15),
  },

  small_shadow_clicked: {
    borderRadius: 10,
    borderColor: "#050301",
    borderWidth: wp(0.25),
  },

  modal_centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modal_size: {
    width: "80%",
    height: "100%",
  },
});

export enum MENU_CATEGORY_NAME {
  DRINKS = "Drinks",
  FRIES = "Fries",
  CHEESESTICK = "Cheesestick",
  SNACK_WITH_DRINK = "Snack with Drink",
  SIOMAI = "Siomai",
  SUPER_MEAL = "Super Meal",
  FRIES_AND_CHEESESTICK = "Fries and Cheesestick",
  SIOMAI_AND_SUPERMEAL = "Siomai and Supermeal",
  OTHERS = "Others",
}
