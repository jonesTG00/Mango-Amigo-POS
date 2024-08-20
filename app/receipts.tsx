import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import defaults from "../assets/defaults";
import { AddOn, AddOnReceipt, OrderSummary, Receipt } from "../assets/db/types";
import ReceiptTab from "../components/ReceiptTab";

export default function Receipts() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [addOns, setAddOns] = useState<AddOnReceipt[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const styles = StyleSheet.create({
    operationsButton: {
      width: hp(5),
      height: hp(5),
      borderRadius: hp(2.5),
    },
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: hp(1),
    },
  });

  const [pagination, setPagination] = useState<number>(1);

  function add_receipts(item: Receipt[]) {
    setReceipts([...receipts, ...item]);
  }
  function add_add_ons(item: AddOnReceipt[]) {
    setAddOns([...addOns, ...item]);
  }

  const db = useSQLiteContext();
  async function order_to_display() {
    setOrders([]);
    setReceipts([]);
    setAddOns([]);
    setOrders(
      await db.getAllAsync(
        `
      SELECT * FROM order_summary ORDER BY order_id DESC LIMIT ${
        20 * pagination
      } OFFSET ${(pagination - 1) * 20};
      `
      )
    );

    orders.map(async (el) => {
      add_receipts(
        await db.getAllAsync(
          `
          SELECT * FROM receipts WHERE order_id = ${el.order_id}
          `
        )
      );
    });
  }

  useEffect(() => {
    order_to_display();
  }, [pagination]);

  function display_receipts() {}

  return (
    <View style={[defaults.big_shadow, styles.container]}>
      <View style={[{ width: "10%" }]}>
        <Text>Receipts</Text>
        <Link href="Home" asChild>
          <Pressable
            style={[styles.operationsButton, { backgroundColor: "#FFC1CC" }]}
          >
            <Text>&lt;-</Text>
          </Pressable>
        </Link>
      </View>
      <ReceiptTab width={"30%"} checkout={false} editable={false} />
    </View>
  );
}
