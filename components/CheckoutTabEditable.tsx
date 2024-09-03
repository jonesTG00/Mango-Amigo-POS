import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import defaults, { ReceiptImagesURI } from "../assets/defaults";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useContext, useEffect, useState } from "react";
import { AddOnReceipt, Receipt } from "../assets/db/types";
import FileUpload from "./FileUpload";
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ReceiptContext, ReceiptContextDetails } from "../app/index";

interface CheckoutTabEditableDetails {
  receipt_list: {
    receipt: Receipt;
    menu_name: string;
    add_on: AddOnReceipt[];
  }[];
  amount: number;
}

export default function CheckoutTabEditable(props: CheckoutTabEditableDetails) {
  const { receipt_list, amount } = props;
  const [mop, setMOP] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountCash, setDiscountCash] = useState<number>(0);
  const [dineInTakeOut, setDineInTakeOut] = useState<string>("");
  const [tenderedAmount, setTenderedAmount] = useState<number>(0);
  const [discountVisibility, setDiscountVisibility] = useState<boolean>(false);
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [addOnAmount, setAddOnAmount] = useState<number>(0);
  const [uri, setURI] = useState<string>("");

  const MOP_LIST = ["CASH", "GCASH", "MAYA"];
  const dt = ["Dine-in", "Take-out"];

  const db = useSQLiteContext();

  const receiptContext = useContext(ReceiptContext) as ReceiptContextDetails;

  const styles = StyleSheet.create({
    checkout_title_text: {
      fontFamily: "Monument",
      fontSize: hp(2),
    },
    checkout_content_text: {
      fontFamily: "Poppins",
      fontSize: hp(1),
    },
    title_text: {
      fontFamily: "Monument",
      fontSize: hp(3),
      textAlign: "center",
    },

    checkout_section: {
      width: "60%",
      display: "flex",
      flexDirection: "row",
    },
    specifications_button: {
      paddingHorizontal: hp(0.5),
      paddingVertical: hp(1),
      width: "30%",
    },
    specification_container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      width: "90%",
      gap: hp(1),
      alignSelf: "center",
    },
    discount_container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "flex-end",
      width: "90%",
      gap: hp(1),
      alignSelf: "center",
    },
    discount_text_input: {
      width: "30%",
      borderWidth: hp(0.2),
      padding: hp(0.2),
    },

    checkout_container: { width: "50%", padding: hp(1) },
  });

  function specificationButtons(
    index: number,
    el: string,
    dbData: string,
    setDbData: (i: string) => void
  ) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setDbData(el);
        }}
        style={[
          styles.specifications_button,
          defaults.small_shadow,
          dbData === el
            ? { backgroundColor: "#03C04A" }
            : { backgroundColor: "white" },
        ]}
      >
        <Text style={[styles.checkout_content_text]}>{el}</Text>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    let itemTotal = 0;
    for (let index = 0; index < receipt_list.length; index++) {
      itemTotal +=
        receipt_list[index].receipt.item_price *
        receipt_list[index].receipt.quantity;
    }
    setItemAmount(itemTotal);

    let addOnTotal = 0;
    for (let index = 0; index < receipt_list.length; index++) {
      addOnTotal +=
        receipt_list[index].receipt.add_on_price *
        receipt_list[index].receipt.quantity;
    }
    setAddOnAmount(addOnTotal);
  }, [receipt_list]);

  function handleDiscountPercentageChange(text: string) {
    try {
      setDiscountPercent(parseInt(text));
    } catch (error) {
      Alert.alert(error as string);
    }
  }

  function handleDiscountCashChange(text: string) {
    try {
      setDiscountCash(parseInt(text));
    } catch (error) {
      Alert.alert(error as string);
    }
  }
  function handleTenderedAmountChange(text: string) {
    try {
      setTenderedAmount(parseInt(text));
    } catch (error) {
      Alert.alert(error as string);
    }
  }

  async function HandleCheckout() {
    // const { receipt_list, amount } = props;
    // const [mop, setMOP] = useState<string>("");
    // const [discountPercent, setDiscountPercent] = useState<number>(0);
    // const [discountCash, setDiscountCash] = useState<number>(0);
    // const [dineInTakeOut, setDineInTakeOut] = useState<string>("");
    // const [total, setTotal] = useState<number>(0);
    // const [selectedMOP, setSelectedMOP] = useState<number>(-1);
    // const [discountVisibility, setDiscountVisibility] = useState<boolean>(false);
    // const [itemAmount, setItemAmount] = useState<number>(0);
    // const [addOnAmount, setAddOnAmount] = useState<number>(0);
    // const [uri, setURI] = useState<string>("");

    if ((mop === "GCASH" || mop === "MAYA") && uri === "") {
      Alert.alert("Image of receipt is required for e-wallet payments");
      return;
    }

    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (
      permission.status === ImagePicker.PermissionStatus.UNDETERMINED ||
      permission.status === ImagePicker.PermissionStatus.DENIED
    ) {
      const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status.granted === true) {
        HandleCheckout();
      }
    } else {
      if (mop === "") {
        Alert.alert("MOP must be set");
        return;
      }

      if (dineInTakeOut === "") {
        Alert.alert("Choose if dine-in or take-out");
        return;
      }

      if (
        discountPercent < 0 ||
        discountPercent > 100 ||
        discountCash > amount ||
        discountCash < 0
      ) {
        Alert.alert("Invalid value for discounts");
        return;
      }

      let afterDiscount = amount;
      if (discountPercent !== 0) {
        console.log(
          "formula : " + Math.ceil(amount - amount * (discountPercent / 100))
        );

        afterDiscount = Math.ceil(
          afterDiscount - afterDiscount * (discountPercent / 100)
        );
        console.log("total after adjustment: " + afterDiscount);
      }

      if (discountCash !== 0) {
        afterDiscount = afterDiscount - discountCash;
        console.log("total after adjustment" + afterDiscount);
      }

      Alert.alert("Total is " + afterDiscount);

      if (tenderedAmount < afterDiscount) {
        Alert.alert("Tendered amount is lower than total price after discount");
        return;
      }

      const orderId = Date.now();

      // receipts(receipt_id INTEGER NOT NULL, order_id TEXT NOT NULL, type TEXT NOT NULL, item_id TEXT NOT NULL, specifications TEXT NOT NULL, quantity INTEGER DEFAULT 1, add_on_price INTEGER DEFAULT 0, item_price INTEGER NOT NULL, total_price INTEGER NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (receipt_id, order_id));
      // order_summary(order_id TEXT PRIMARY KEY NOT NULL, mode_of_payment TEXT CHECK (mode_of_payment IN ('GCASH', 'MAYA', "CASH")) NOT NULL, discount_percentage INTEGER DEFAULT 0, discount_cash INTEGER DEFAULT 0, d_t TEXT CHECK(d_t in ('D','T')) NOT NULL, raw_total NUMBER NOT NULL, total NUMBER NOT NULL, tendered_amount NUMBER NOT NULL, change NUMBER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      // add_on_receipts(order_id TEXT NOT NULL, receipt_id INTEGER NOT NULL, for INTEGER NOT NULL, add_ons_id TEXT NOT NULL, PRIMARY KEY (order_id, receipt_id));

      await db
        .execAsync(
          `
      INSERT INTO order_summary(order_id, mode_of_payment, discount_percentage, discount_cash, d_t, raw_total, total, tendered_amount, change) VALUES (
      "${orderId}",
      "${mop}",
      ${discountPercent},
      ${discountCash},
      "${dineInTakeOut === "Dine-in" ? "D" : "T"}",
      ${amount},
      ${afterDiscount},
      ${tenderedAmount},
      ${tenderedAmount - afterDiscount}
      );
      `
        )
        .then(() => {
          console.log("order summary added");
          receiptContext.reset_receipt();
        })
        .catch((e) => {
          console.log("error in order summary");
          console.log(e);
        })
        .finally(() => console.log("inserting to order_summary done"));

      receipt_list.map(async (el) => {
        await db
          .execAsync(
            `
        INSERT INTO receipts(receipt_id, order_id, type, item_id, specifications, quantity, add_on_price, item_price, total_price, receipt_description) VALUES (
        ${el.receipt.receipt_id},
        "${orderId}",
        "${el.receipt.type}",
        "${el.receipt.item_id}",
        "${el.receipt.specifications}",
        ${el.receipt.quantity},
        ${el.receipt.add_on_price},
        ${el.receipt.item_price},
        ${el.receipt.total_price},
        "${el.receipt.receipt_description}"
        );
        `
          )
          .then(() => console.log(`${el.menu_name} added`))
          .catch((e) => {
            console.log("error in receipts");

            console.log(e);
          })
          .finally(() => console.log("inserting to receipt done"));

        if (mop === "GCASH" || mop === "MAYA") {
        }
      });

      receipt_list.map((el) => {
        if (el.receipt.add_on_price !== 0) {
          el.add_on.map(async (add_on) => {
            await db
              .execAsync(
                `
            INSERT INTO add_on_receipts VALUES (
            "${add_on.order_id}",
            ${add_on.receipt_id},
            ${add_on.for},
            "${add_on.add_ons_id}"
            );
            `
              )
              .then(() => console.log(`${add_on.add_ons_id} added`))
              .catch((e) => {
                console.log("error in receipts");

                console.log(e);
              })
              .finally(() => console.log("inserting to add_on done"));
          });
        }
      });

      await db
        .getAllAsync(
          `
      SELECT * FROM order_summary
      `
        )
        .then((e) => console.log(e));
      try {
        // const newURI = "../assets/receipts/" + orderId + ".jpg";
        const newURI = ReceiptImagesURI(orderId.toString());
        await FileSystem.copyAsync({ from: uri, to: newURI }).then(() =>
          console.log("image transferred")
        );
        await FileSystem.deleteAsync(uri);
      } catch (error) {
        console.log(error);
      }

      Alert.alert("Done");
    }
  }

  return (
    <View style={[defaults.big_shadow, styles.checkout_container]}>
      <Text style={[styles.title_text, { textAlign: "auto" }]}>Deets</Text>
      <Text style={[styles.checkout_content_text, { fontWeight: "bold" }]}>
        Total Amount :<Text style={{ color: "#118c4f" }}> P{amount}</Text>
      </Text>
      <Text style={[styles.checkout_content_text]}>
        Total Item Amount :
        <Text style={{ color: "#118c4f" }}> P{itemAmount}</Text>
      </Text>
      <Text style={[styles.checkout_content_text]}>
        Add On Amount :<Text style={{ color: "#118c4f" }}> P{addOnAmount}</Text>
      </Text>
      <ScrollView>
        <View style={{ gap: hp(1) }}>
          <View>
            <Text style={[styles.checkout_title_text]}>Mode of Payment</Text>
            <View style={[styles.specification_container]}>
              {MOP_LIST.map((el, index) => {
                return specificationButtons(index, el, mop, setMOP);
              })}
            </View>
            {(mop === "GCASH" || mop === "MAYA") && (
              <FileUpload uri={uri} setURI={setURI} />
            )}
          </View>
          <View>
            <Text style={[styles.checkout_title_text]}>
              Dine-in or Take-out
            </Text>
            <View style={[styles.specification_container]}>
              {dt.map((el, index) => {
                return specificationButtons(
                  index,
                  el,
                  dineInTakeOut,
                  setDineInTakeOut
                );
              })}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setDiscountVisibility(discountVisibility ? false : true);
            }}
            style={[defaults.big_shadow, { padding: hp(1) }]}
          >
            <Text style={[styles.checkout_title_text, { textAlign: "center" }]}>
              Discounted?
            </Text>
          </TouchableOpacity>
          {discountVisibility && (
            <View style={[styles.discount_container]}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: hp(1),
                  alignItems: "center",
                }}
              >
                <View style={{ width: "20%" }}>
                  <Text style={[styles.checkout_content_text]}>Discount %</Text>
                </View>
                <TextInput
                  style={[styles.discount_text_input]}
                  keyboardType="numeric"
                  onChangeText={(e) => handleDiscountPercentageChange(e)}
                  defaultValue="0"
                />
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: hp(1),
                  alignItems: "center",
                }}
              >
                <View style={{ width: "20%" }}>
                  <Text style={[styles.checkout_content_text]}>
                    Discount Cash
                  </Text>
                </View>
                <TextInput
                  style={[styles.discount_text_input]}
                  keyboardType="numeric"
                  defaultValue="0"
                  onChangeText={(e) => handleDiscountCashChange(e)}
                />
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: hp(1),
            alignItems: "center",
            marginVertical: hp(1),
          }}
        >
          <View>
            <Text style={[styles.checkout_content_text]}>Tendered Amount</Text>
          </View>
          <TextInput
            style={[styles.discount_text_input]}
            keyboardType="numeric"
            onChangeText={handleTenderedAmountChange}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[defaults.small_shadow, { width: "50%", alignSelf: "flex-end" }]}
        onPress={HandleCheckout}
      >
        <Text
          style={{
            fontFamily: "Monument",
            fontSize: hp(2),
            textAlign: "center",
          }}
        >
          Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

//RESET RECEIPT DBs
// async () => {
//   await db
//     .execAsync(
//       `
//     DELETE FROM order_summary;
//     DELETE FROM receipts;
//     DELETE FROM add_on_receipts;
//     `
//     )
//     .then(() => console.log("db deleted"));
// }
