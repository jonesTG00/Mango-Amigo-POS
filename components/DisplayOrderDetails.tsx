import { useSQLiteContext } from "expo-sqlite";
import { AddOnReceipt, OrderSummary, Receipt } from "../assets/db/types";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import defaults from "../assets/defaults";

interface OrderDetailsProps {
  receipts: Receipt[];
  // order: OrderSummary;
}

export default function OrderDetails(props: OrderDetailsProps) {
  const db = useSQLiteContext();
  const { receipts } = props;

  const styles = StyleSheet.create({
    container: {
      width: "60%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      gap: hp(1),
    },
    division: {
      width: "50%",
      height: "100%",
      padding: hp(1),
      backgroundColor: "#f1f1f1",
    },
    receipt_text: {
      fontFamily: "Poppins",
      textAlign: "center",
      fontSize: hp(1),
    },

    menu_item_button: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      padding: hp(0.5),
    },
  });

  function display_receipt_items(item: Receipt, index: number) {
    return (
      <View style={[styles.menu_item_button]} key={index}>
        <View style={{ width: "20%" }}>
          <Text style={[styles.receipt_text]}>{item.quantity}</Text>
        </View>
        <View style={{ width: "60%" }}>
          <Text style={[styles.receipt_text]}>{item.receipt_description}</Text>
        </View>
        <View style={{ width: "20%" }}>
          <Text style={[styles.receipt_text]}>{item.total_price}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={[styles.division]}>
        <Text
          style={{
            fontFamily: "Monument",
            fontSize: hp(2),
            color: "black",
            textAlign: "center",
          }}
        >
          Receipts
        </Text>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ width: "20%" }}>
            <Text style={[styles.receipt_text, { fontSize: hp(0.75) }]}>
              Qty
            </Text>
          </View>
          <View style={{ width: "60%" }}>
            <Text style={[styles.receipt_text, { fontSize: hp(0.75) }]}>
              Menu Name
            </Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={[styles.receipt_text, { fontSize: hp(0.75) }]}>
              Price
            </Text>
          </View>
        </View>

        <ScrollView>
          <View style={{ gap: hp(1) }}>
            {receipts.map((el, index) => {
              return display_receipt_items(el, index);
            })}
          </View>
        </ScrollView>
      </View>
      <View style={[styles.division]}>
        <Text
          style={{
            fontFamily: "Monument",
            fontSize: hp(2),
          }}
        >
          Deets
        </Text>
        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Total Amount:
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          ></Text>
        </Text>
      </View>
    </View>
  );
}
