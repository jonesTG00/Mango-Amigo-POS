import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import defaultStyles, { MENU_CATEGORY_NAME } from "../assets/defaults";
import { useFonts } from "expo-font";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  FriesAndCheesestickList,
  SiomaiAndSuperMealList,
  DrinkList,
  Cheesestick,
  SnackWithDrink,
  Fries,
  Siomai,
  SuperMeal,
  DrinkData,
  OtherList,
  OtherData,
  Receipt,
  AddOnReceipt,
} from "../assets/db/types";
import { useContext, useEffect, useState } from "react";
import MenuItemsButton from "./MenuItemsButton";
import MakeOrderTab from "./MakeOrderTab";

import menuJson from "../assets/db/menuItems.json";
import AddOnTab from "./AddOnTab";
import ReceiptTab from "./ReceiptTab";
import { useSQLiteContext } from "expo-sqlite";
import { ReceiptContext, ReceiptContextDetails } from "./Landing";
import MenuModalReceipt from "./MenuModalReceipt";

interface ModalMenuDetails {
  onClose: () => void;
  menu_category_name: string;
  isVisible: boolean;
  color: string;
}
export default function MenuModal(props: ModalMenuDetails) {
  const { onClose, menu_category_name, isVisible, color } = props;
  const [fonts] = useFonts({
    Boogaloo: require("../assets/fonts/Boogaloo.ttf"),
    Monument: require("../assets/fonts/Monument Extended.otf"),
  });

  const [toAddReceipt, setToAddReceipt] = useState<
    { receipt: Receipt; menu_name: string; add_on: AddOnReceipt[] }[]
  >([]);
  const [buttonBackground, setButtonBackground] = useState<string>("");

  function addToTemporaryReceipt(item: {
    receipt: Receipt;
    menu_name: string;
    add_on: AddOnReceipt[];
  }) {
    setToAddReceipt([...toAddReceipt, item]);
  }

  function removeFromReceipt(id: number) {
    const newArray = [...toAddReceipt];
    const index = newArray.findIndex((item) => item.receipt.receipt_id === id);
    newArray.splice(index, 1);
    setToAddReceipt(newArray);
  }

  const [itemSelected, setItemSelected] = useState<
    | DrinkData
    | Fries
    | Cheesestick
    | SnackWithDrink
    | Siomai
    | SuperMeal
    | OtherData
    | null
  >(null);

  const styles = StyleSheet.create({
    modal_centered: { backgroundColor: color, padding: wp(3) },
    modalSize: {
      backgroundColor: "white",
      padding: wp(3),
      display: "flex",
      gap: hp(1),
    },
    menu_title: {
      fontFamily: "Monument",
      fontSize: hp(3),
      borderBottomWidth: wp(0.5),
      borderBottomColor: "#050301",
    },
    backButton: {
      padding: wp(1),
      width: "30%",
      alignItems: "center",
      alignSelf: "flex-end",
    },
    backText: {
      color: "black",
      fontFamily: "Monument",
      fontSize: hp(1),
    },
    scrollView: {
      width: "25%",
      paddingBottom: hp(1),
      flexGrow: 0,
    },
    functionsContainer: {
      height: "80%",
      display: "flex",
      flexDirection: "row",
      gap: wp(1),
    },
  });

  const receiptContext = useContext(ReceiptContext) as ReceiptContextDetails;

  return (
    <>
      <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
        <View style={[defaultStyles.modal_centered, styles.modal_centered]}>
          <View
            style={[
              defaultStyles.modal_size,
              defaultStyles.big_shadow,
              styles.modalSize,
            ]}
          >
            <Text style={[styles.menu_title]}>{menu_category_name}</Text>
            <View style={[styles.functionsContainer]}>
              <ScrollView
                showsVerticalScrollIndicator={true}
                style={[styles.scrollView]}
              >
                {menu_category_name === MENU_CATEGORY_NAME.DRINKS ? (
                  Object.values(DrinkList).map((el: DrinkData[]) => (
                    <>
                      {el.map((menu) => {
                        return (
                          <MenuItemsButton
                            menu_name={menu.menu_name}
                            menu_data={menu}
                            change_item_selected={setItemSelected}
                            key={menu.id}
                            buttonBackground={buttonBackground}
                            setButtonBackground={setButtonBackground}
                            color={color}
                          />
                        );
                      })}
                    </>
                  ))
                ) : menu_category_name ===
                  MENU_CATEGORY_NAME.FRIES_AND_CHEESESTICK ? (
                  Object.values(FriesAndCheesestickList).map(
                    (el: Fries[] | Cheesestick[] | SnackWithDrink[]) => (
                      <>
                        {el.map((menu) => {
                          return (
                            <MenuItemsButton
                              menu_name={menu.menu_name}
                              menu_data={menu}
                              change_item_selected={setItemSelected}
                              key={menu.id}
                              buttonBackground={buttonBackground}
                              setButtonBackground={setButtonBackground}
                              color={color}
                            />
                          );
                        })}
                      </>
                    )
                  )
                ) : menu_category_name ===
                  MENU_CATEGORY_NAME.SIOMAI_AND_SUPERMEAL ? (
                  Object.values(SiomaiAndSuperMealList).map(
                    (el: Siomai[] | SuperMeal[]) => (
                      <>
                        {el.map((menu) => {
                          return (
                            <MenuItemsButton
                              menu_name={menu.menu_name}
                              menu_data={menu}
                              change_item_selected={setItemSelected}
                              key={menu.id}
                              buttonBackground={buttonBackground}
                              setButtonBackground={setButtonBackground}
                              color={color}
                            />
                          );
                        })}
                      </>
                    )
                  )
                ) : menu_category_name === MENU_CATEGORY_NAME.OTHERS ? (
                  Object.values(OtherList).map((el: OtherData[]) => (
                    <>
                      {el.map((menu) => {
                        return (
                          <MenuItemsButton
                            menu_name={menu.menu_name}
                            menu_data={menu}
                            change_item_selected={setItemSelected}
                            key={menu.id}
                            buttonBackground={buttonBackground}
                            setButtonBackground={setButtonBackground}
                            color={color}
                          />
                        );
                      })}
                    </>
                  ))
                ) : (
                  <Text>Meh</Text>
                )}
              </ScrollView>
              <MakeOrderTab
                menu_item={
                  itemSelected === null
                    ? menu_category_name === MENU_CATEGORY_NAME.DRINKS
                      ? menuJson["Drinks"][0]
                      : menu_category_name ===
                        MENU_CATEGORY_NAME.FRIES_AND_CHEESESTICK
                      ? menuJson["Fries"][0]
                      : menu_category_name ===
                        MENU_CATEGORY_NAME.SIOMAI_AND_SUPERMEAL
                      ? menuJson["Siomai"][0]
                      : menuJson["Others"][0]
                    : itemSelected
                }
                menu_category_name={menu_category_name}
                color={color}
                receipt_list={toAddReceipt}
                add_receipt={addToTemporaryReceipt}
              />
              <MenuModalReceipt
                width={"35%"}
                receipt_list={toAddReceipt}
                remove_from_receipt={removeFromReceipt}
              />
            </View>
            <TouchableOpacity
              style={[styles.backButton, defaultStyles.small_shadow, toAddReceipt.length === 0 ? { backgroundColor: "#ffffff" }
                : { backgroundColor: "#03C04A" }]}
              onPress={() => {
                receiptContext.add_receipt(toAddReceipt);
                setToAddReceipt([]);
                setItemSelected(null);
                onClose();
              }}
            >
              <Text style={[styles.backText]}>
                {
                  toAddReceipt.length > 0 ? "Add & Close": "Close"
                }
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
