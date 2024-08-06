import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import * as React from "react";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useFonts } from "expo-font";

import defaultStyles from "../assets/defaults";
import { Receipt } from "../assets/db/types";
import { useEffect } from "react";

interface ReceiptTabDetails {
  width: `${number}%`;
  receipt_list: { receipt: Receipt; menu_name: string }[] | [];
  remove_from_receipt: (id: string) => void;
}

export default function ReceiptTab(props: ReceiptTabDetails) {
  const { width, receipt_list, remove_from_receipt } = props;
  const [fonts] = useFonts({
    Monument: require("../assets/fonts/Monument Extended.otf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
  });

  const styles = StyleSheet.create({
    container: {
      height: "100%",
      width: width,
      display: "flex",
      alignItems: "center",
      padding: hp(1),
      backgroundColor: "white",
    },
    content_container: {
      display: "flex",
      flexDirection: "row",
      width: "90%",
      justifyContent: "space-around",
      alignItems: "center",
    },
    heading_text: {
      fontFamily: "Monument",
      fontSize: hp(1),
    },
    content_text: {
      textAlign: "center",
      alignSelf: "center",
      fontFamily: "Poppins",
      fontSize: hp(1.5),
    },
    menu_item_button: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      padding: hp(0.5),
      backgroundColor: "white",
    },
    receipt_text: {
      fontFamily: "Poppins",
      textAlign: "center",
    },
  });

  function generate_receipt_details(
    item: {
      receipt: Receipt;
      menu_name: string;
    },
    index: number
  ) {
    return (
      <TouchableOpacity
        style={[styles.menu_item_button, defaultStyles.small_shadow]}
        onPress={() => remove_from_receipt(item.receipt.receipt_id)}
        key={index}
      >
        <View style={{ width: "10%" }}>
          <Text style={[styles.receipt_text]}>{item.receipt.quantity}</Text>
        </View>
        <View style={{ width: "80%" }}>
          <Text style={[styles.receipt_text]}>{item.menu_name}</Text>
        </View>
        <View style={{ width: "10%" }}>
          <Text style={[styles.receipt_text]}>{item.receipt.total_price}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (!fonts) {
    return <Text>Wait</Text>;
  }
  return (
    <View style={[styles.container, defaultStyles.big_shadow]}>
      <Text
        style={{
          fontFamily: "Monument",
          fontSize: hp(2),
          color: "black",
        }}
      >
        Receipt
      </Text>

      <View style={{ display: "flex", flexDirection: "row" }}>
        <View style={{ width: "20%" }}>
          <Text style={[styles.receipt_text]}>Qty</Text>
        </View>
        <View style={{ width: "60%" }}>
          <Text style={[styles.receipt_text]}>Menu Name</Text>
        </View>
        <View style={{ width: "20%" }}>
          <Text style={[styles.receipt_text]}>Price</Text>
        </View>
      </View>

      <ScrollView>
        <View style={{ gap: hp(1) }}>
          {receipt_list.map((el, index) => {
            return generate_receipt_details(el, index);
          })}
        </View>
      </ScrollView>
    </View>
  );
}
