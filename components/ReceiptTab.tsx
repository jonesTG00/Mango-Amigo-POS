import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as React from "react";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { useFonts } from "expo-font";

import defaultStyles from "../assets/defaults";
import { AddOnReceipt, Receipt } from "../assets/db/types";
import { useContext, useEffect, useState } from "react";
import menuJson from "../assets/db/menuItems.json";
import { useSQLiteContext } from "expo-sqlite";
import CheckoutModal from "./CheckoutModal";
import { ReceiptContext, ReceiptContextDetails } from "./Landing";

interface ReceiptTabDetails {
  width: `${number}%`;
  checkout: boolean;
  editable: boolean;
}

export default function ReceiptTab(props: ReceiptTabDetails) {
  const { width, checkout, editable } = props;
  const [total, setTotal] = useState<number>(0);
  const [fonts] = useFonts({
    Monument: require("../assets/fonts/Monument Extended.otf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
  });

  const [isVisibleCheckout, setIsVisibleCheckout] = useState<boolean>(false);
  const receiptContext = useContext(ReceiptContext) as ReceiptContextDetails;

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < receiptContext.receipt.length; index++) {
      sum += receiptContext.receipt[index].receipt.total_price;
    }
    setTotal(sum);
  }, [receiptContext.receipt]);

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
      fontSize: hp(1),
    },
    checkout_container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingVertical: hp(1),
      paddingHorizontal: hp(2),
      borderRadius: hp(1),
    },

    total_text: {
      fontFamily: "Monument",
      fontSize: hp(2),
    },

    checkout: {
      paddingHorizontal: hp(1),
      paddingVertical: hp(2),
      alignSelf: "flex-end",
    },
  });

  function setBackgroundColor(type: string): string {
    if (type === "DRINKS") {
      return "#FFB22C";
    } else if (
      type === "FRIES" ||
      type === "CHEESESTICKS" ||
      type === "SNACK WITH DRINKS"
    ) {
      return "#FF4C4C";
    } else if (type === "SIOMAI" || type === "SUPER MEALS") {
      return "#9A9DDD";
    } else {
      return "#FADDE1";
    }
  }

  function generate_receipt_details(
    item: {
      receipt: Receipt;
      menu_name: string;
    },
    index: number
  ) {
    if (editable) {
      return (
        <TouchableOpacity
          style={[
            styles.menu_item_button,
            defaultStyles.small_shadow,
            { backgroundColor: setBackgroundColor(item.receipt.type) },
          ]}
          onPress={() => receiptContext.remove_receipt(item.receipt.receipt_id)}
          key={index}
        >
          <View style={{ width: "20%" }}>
            <Text style={[styles.receipt_text]}>{item.receipt.quantity}</Text>
          </View>
          <View style={{ width: "60%" }}>
            <Text style={[styles.receipt_text]}>{item.menu_name}</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={[styles.receipt_text]}>
              {item.receipt.total_price}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={[
          styles.menu_item_button,
        ]}
        key={index}
      >
        <View style={{ width: "20%" }}>
          <Text style={[styles.receipt_text ]}>{item.receipt.quantity}</Text>
        </View>
        <View style={{ width: "60%" }}>
          <Text style={[styles.receipt_text]}>{item.menu_name}</Text>
        </View>
        <View style={{ width: "20%" }}>
          <Text style={[styles.receipt_text]}>{item.receipt.total_price}</Text>
        </View>
      </View>
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
          <Text style={[styles.receipt_text, {fontSize: hp(.75)}]}>Qty</Text>
        </View>
        <View style={{ width: "60%" }}>
          <Text style={[styles.receipt_text, {fontSize: hp(.75)}]}>Menu Name</Text>
        </View>
        <View style={{ width: "20%" }}>
          <Text style={[styles.receipt_text, {fontSize: hp(.75)}]}>Price</Text>
        </View>
      </View>

      <ScrollView>
        <View style={{ gap: hp(1) }}>
          {receiptContext.receipt.map((el, index) => {
            return generate_receipt_details(el, index);
          })}
        </View>
      </ScrollView>

      {checkout && (
        <View
          style={[
            styles.checkout_container,
            defaultStyles.small_shadow,
            total === 0
              ? { backgroundColor: "#f94449" }
              : { backgroundColor: "#03C04A" },
          ]}
        >
          <Text style={[styles.total_text]}>
            <Text style={{ color: "black" }}>Total Price:</Text> P{total}
          </Text>
          <TouchableOpacity
            style={[styles.checkout, defaultStyles.small_shadow]}
            onPress={() => {
              receiptContext.receipt.length === 0
                ? Alert.alert("No items added yet")
                : setIsVisibleCheckout(true);
            }}
          >
            <Text style={{ fontFamily: "Monument", fontSize: hp(2) }}>
              Checkout
            </Text>
            <CheckoutModal
              receipt_list={receiptContext.receipt}
              amount={total}
              isVisible={isVisibleCheckout}
              close={() => setIsVisibleCheckout(false)}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
