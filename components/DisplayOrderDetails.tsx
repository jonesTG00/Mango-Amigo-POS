import { useSQLiteContext } from "expo-sqlite";
import { AddOnReceipt, OrderSummary, Receipt } from "../assets/db/types";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import defaults, { ReceiptImagesURI } from "../assets/defaults";
import { Image } from "expo-image";

interface OrderDetailsProps {
  receipts: Receipt[];
  order: OrderSummary | undefined;
}

export default function OrderDetails(props: OrderDetailsProps) {
  const db = useSQLiteContext();
  const { receipts, order } = props;
  const [image, setImage] = useState<string>("");

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

        {receipts.length === 0 && (
          <Text
            style={{
              fontFamily: "Monument",
              fontSize: hp(2),
              textAlign: "center",
            }}
          >
            Loading...
          </Text>
        )}

        {receipts.length > 0 && (
          <>
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
          </>
        )}
      </View>
      <View style={[styles.division]}>
        <Text
          style={{
            fontFamily: "Monument",
            fontSize: hp(2),
            textAlign: "center",
          }}
        >
          Deets
        </Text>
        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Total Amount:
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          >
            {" P" + order?.total || "Loading..."}
          </Text>
        </Text>

        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Raw Total:
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          >
            {" P" + order?.raw_total || "Loading..."}
          </Text>
        </Text>

        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Discount - %:
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          >
            {" " + order?.discount_percentage + "%" || "Loading..."}
          </Text>
        </Text>

        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Discount - Cash:
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          >
            {" P" + order?.discount_cash || "Loading..."}
          </Text>
        </Text>

        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Mode of Payment:
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          >
            {" " + order?.mode_of_payment || "Loading..."}
          </Text>
        </Text>

        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Tendered Amount
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          >
            {" P" + order?.tendered_amount || "Loading..."}
          </Text>
        </Text>

        <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
          Change
          <Text
            style={{ fontFamily: "Poppins", fontSize: hp(1), color: "#118c4f" }}
          >
            {" P" + order?.change || "Loading..."}
          </Text>
        </Text>

        <Text
          style={{ fontFamily: "Monument", fontSize: hp(1), color: "#118c4f" }}
        >
          {(order?.d_t === "D" ? "Dine-in" : "Take-out") || "Loading..."}
        </Text>

        {(order?.mode_of_payment === "GCASH" ||
          order?.mode_of_payment === "MAYA") && (
          <View style={{ width: "100%" }}>
            <Image
              source={{ uri: ReceiptImagesURI(order.order_id.toString()) }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
