import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import defaults from "../assets/defaults";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import { AddOnReceipt, Receipt } from "../assets/db/types";

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
  const [total, setTotal] = useState<number>(0);
  const [selectedMOP, setSelectedMOP] = useState<number>(-1);
  const [discountVisibility, setDiscountVisibility] = useState<boolean>(false);
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [addOnAmount, setAddOnAmount] = useState<number>(0);

  const MOP_LIST = ["CASH", "GCASH", "MAYA"];
  const dt = ["Dine-in", "Take-out"];

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
                  marginTop: hp(2)
                }}
              >
                <View>
                  <Text style={[styles.checkout_content_text]}>
                    Tendered Amount
                  </Text>
                </View>
                <TextInput
                  style={[styles.discount_text_input]}
                  keyboardType="numeric"
                />
              </View>
      </ScrollView>
      
    </View>
  );
}
