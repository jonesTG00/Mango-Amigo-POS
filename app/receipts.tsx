import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import defaults from "../assets/defaults";
import { AddOnReceipt, OrderSummary, Receipt } from "../assets/db/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../assets/screentypes";
import DisplayOrderDetails from "../components/DisplayOrderDetails";

type Props = NativeStackScreenProps<StackParamList, "Receipts">;
export default function Receipts({ route, navigation }: Props) {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [addOns, setAddOns] = useState<AddOnReceipt[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: hp(1),
      backgroundColor: "#FFB22C",
    },
    order_button: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      padding: hp(1),
      marginBottom: hp(1),
    },
    order_button_small_text: {
      fontFamily: "Monument",
      fontSize: hp(1),
    },
    order_button_big_text: {
      fontFamily: "Monument",
      fontSize: hp(2),
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

  async function manage_pagination() {
    await db
      .getAllAsync<OrderSummary>(
        `
        SELECT * FROM order_summary ORDER BY order_id DESC 
        LIMIT ${20 * pagination} 
        OFFSET ${(pagination - 1) * 20};
      `
      )
      .then((e) => {
        setOrders(e);
        setSelectedOrder(e[0].order_id);
        setSelectedIndex(0);
      })
      .catch((e) => console.log(e));
  }

  function displayorders(order: OrderSummary, index: number) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const toInsert = parseInt(order.order_id.toString());
    const date = new Date(toInsert);

    const dateString = `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;

    const time = `${
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${
      date.getHours() > 12 ? "PM" : "AM"
    }`;

    return (
      <TouchableOpacity
        style={[
          styles.order_button,
          defaults.small_shadow,
          selectedOrder === order.order_id
            ? { backgroundColor: "#FFB22C" }
            : { backgroundColor: "#F1F1F1" },
        ]}
        onPress={() => {
          setSelectedOrder(order.order_id);
          setSelectedIndex(index);
          console.log(`Order ${order.order_id} is selected`);
        }}
        key={order.order_id}
      >
        <View>
          <Text style={styles.order_button_small_text}>
            <Text
              style={
                selectedOrder === order.order_id
                  ? { color: "black" }
                  : { color: "#FFB22C" }
              }
            >
              Order Number :
            </Text>{" "}
            {order.order_id}
          </Text>
          <Text
            style={[
              { textAlign: "right", fontFamily: "Poppins", fontSize: hp(0.75) },
            ]}
          >
            Total:
          </Text>
          <Text style={[styles.order_button_big_text, { textAlign: "right" }]}>
            P{order.total}
          </Text>
          <Text style={styles.order_button_small_text}>{dateString}</Text>
          <Text style={styles.order_button_small_text}>{time}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function increasePageNumber() {
    setPagination(pagination + 1);
  }

  function decreasePageNumber() {
    if (pagination === 1) {
      Alert.alert("Already on first page");
      return;
    }
    setPagination(pagination - 1);
  }

  useEffect(() => {
    setLoading(true);
    async function handleChange() {
      await manage_pagination();
    }
    handleChange();
    setLoading(false);
  }, [pagination]);

  useEffect(() => {
    setLoading(true);

    async function manage_receipts() {
      await db
        .getAllAsync<Receipt>(
          `
            SELECT * FROM receipts WHERE order_id = ${selectedOrder}
            `
        )
        .then((e) => {
          setReceipts(e);
        })
        .catch((e) => console.log(e));
    }
    manage_receipts();
    setLoading(false);
  }, [selectedOrder]);

  useEffect(() => {}, [loading]);

  if (loading) {
    return <Text>Wait</Text>;
  }

  return (
    <View style={[styles.container]}>
      <View style={[{ width: "5%" }]}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: "#f1f1f1",
              padding: hp(1),
              borderRadius: hp(1),
            },
          ]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text
            style={{
              fontFamily: "Monument",
              textAlign: "center",
            }}
          >
            X
          </Text>
        </TouchableOpacity>
      </View>

      <DisplayOrderDetails receipts={receipts} />

      <View
        style={[
          {
            width: "30%",
            height: "100%",
            padding: hp(1),
            backgroundColor: "#F1F1F1",
          },
          defaults.big_shadow,
        ]}
      >
        <Text
          style={{
            fontFamily: "Monument",
            fontSize: hp(2),
            textAlign: "center",
          }}
        >
          ORDERS
        </Text>
        {orders.length === 0 && (
          <View
            style={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Monument", fontSize: hp(1) }}>
              No more to show
            </Text>
          </View>
        )}
        {orders.length > 0 && (
          <ScrollView showsVerticalScrollIndicator={true}>
            {orders.map((el, index) => {
              return displayorders(el, index);
            })}
          </ScrollView>
        )}
        <View
          style={[
            {
              height: "15%",
              backgroundColor: "#9A9DDD",
              borderRadius: hp(1),
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: hp(1),
            },
            defaults.small_shadow,
          ]}
        >
          <Text style={styles.order_button_small_text}>PAGE</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              gap: hp(3),
              height: "100%",
            }}
          >
            <TouchableOpacity
              style={[
                {
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "20%",
                  backgroundColor: "#F1F1F1",
                },
                defaults.small_shadow,
              ]}
              onPress={decreasePageNumber}
            >
              <Text style={[styles.order_button_small_text]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.order_button_small_text]}>{pagination}</Text>
            <TouchableOpacity
              style={[
                {
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "20%",
                  backgroundColor: "#F1F1F1",
                },
                defaults.small_shadow,
              ]}
              onPress={increasePageNumber}
            >
              <Text style={styles.order_button_small_text}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
