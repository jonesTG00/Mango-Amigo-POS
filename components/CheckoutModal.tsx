import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { AddOnReceipt, OrderSummary, Receipt } from "../assets/db/types";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import defaults from "../assets/defaults";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import ReceiptTab from "./ReceiptTab";
import CheckoutTabEditable from "./CheckoutTabEditable";

interface CheckoutModalDetails {
  receipt_list: {
    receipt: Receipt;
    menu_name: string;
    add_on: AddOnReceipt[];
  }[];
  order_summary?: OrderSummary;
  amount: number;
  isVisible: boolean;
  close: () => void;
}

export default function CheckoutModal(props: CheckoutModalDetails) {
  const { receipt_list, amount, isVisible, close } = props;

  const styles = StyleSheet.create({
    modal_centered: { backgroundColor: "#8806ce", padding: wp(3) },
    container: {
      backgroundColor: "white",
      padding: hp(1),
      display: "flex",
      flexDirection: "row",
      gap: hp(1),
      justifyContent: "space-around",
    },
  });

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={[defaults.modal_centered, styles.modal_centered]}>
        <View
          style={[defaults.modal_size, defaults.big_shadow, styles.container]}
        >
          <ReceiptTab width={"40%"} checkout={false} editable={false} />
          <CheckoutTabEditable receipt_list={receipt_list} amount={amount} />
          <TouchableOpacity
            onPress={close}
            style={{ backgroundColor: "white" }}
          >
            <Text
              style={{ fontFamily: "Monument", fontSize: hp(2), color: "red" }}
            >
              X
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
