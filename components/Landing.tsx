import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";

import * as React from "react";
import MenuButton from "../components/MenuCategoryButton";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { AddOnReceipt, Receipt } from "../assets/db/types";
import { useFonts } from "expo-font";
import defaultStyles, { MENU_CATEGORY_NAME } from "../assets/defaults";
import ReceiptTab from "../components/ReceiptTab";
import { createContext, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import menuJson from "../assets/db/menuItems.json";

export interface ReceiptContextDetails {
  receipt: {
    receipt: Receipt;
    menu_name: string;
    add_on: AddOnReceipt[];
  }[];
  add_receipt: (
    item: { receipt: Receipt; menu_name: string; add_on: AddOnReceipt[] }[]
  ) => void;
  remove_receipt: (id: number) => void;
  reset_receipt: () => void;
}
export const ReceiptContext = createContext<ReceiptContextDetails | null>(null);

export default function Landing() {
  const [fonts] = useFonts({
    Monument: require("../assets/fonts/Monument Extended.otf"),
  });

  const [receipt, setReceipt] = useState<
    { receipt: Receipt; menu_name: string; add_on: AddOnReceipt[] }[]
  >([]);

  function add_receipt(
    item: { receipt: Receipt; menu_name: string; add_on: AddOnReceipt[] }[]
  ) {
    setReceipt([...receipt, ...item]);
  }

  function remove_receipt(id: number) {
    const newArray = [...receipt];
    const index = newArray.findIndex((item) => item.receipt.receipt_id === id);
    newArray.splice(index, 1);
    setReceipt(newArray);
  }

  function reset_receipt() {
    setReceipt([]);
  }

  const style = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: hp(2),
      height: "100%",
      gap: hp(1),
    },
    menuDiv: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
      width: "60%",
      padding: hp(2),
      flexWrap: "wrap",
      gap: hp(1),
      backgroundColor: "#ffffff",
      opacity: 0.95,
    },
    menuButtonContainer: {
      display: "flex",
      width: "50%",
      paddingRight: hp(1),
      gap: hp(1),
      height: "100%",
      borderRightColor: "black",
      borderRightWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
    },
  });

  const default_menu = [
    {
      category: MENU_CATEGORY_NAME.DRINKS,
      bg_color: "#FFB22C",
    },
    {
      category: MENU_CATEGORY_NAME.FRIES_AND_CHEESESTICK,
      bg_color: "#FF4C4C",
    },
    {
      category: MENU_CATEGORY_NAME.SIOMAI_AND_SUPERMEAL,
      bg_color: "#9A9DDD",
    },
    {
      category: MENU_CATEGORY_NAME.OTHERS,
      bg_color: "#FADDE1",
    },
  ];

  const db = useSQLiteContext();
  async function logData() {
    await db.getAllAsync(`SELECT * FROM drinks`).catch(async () => {
      console.log("creating");

      await db
        .execAsync(
          `
        CREATE TABLE IF NOT EXISTS receipts(receipt_id INTEGER NOT NULL, order_id TEXT NOT NULL, type TEXT NOT NULL, item_id TEXT NOT NULL, specifications TEXT NOT NULL, quantity INTEGER DEFAULT 1, add_on_price INTEGER DEFAULT 0, item_price INTEGER NOT NULL, total_price INTEGER NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (receipt_id, order_id));
        CREATE TABLE IF NOT EXISTS order_summary(order_id TEXT PRIMARY KEY NOT NULL, mode_of_payment TEXT CHECK (mode_of_payment IN ('GCASH', 'MAYA', "CASH")) NOT NULL, discount_percentage INTEGER DEFAULT 0, discount_cash INTEGER DEFAULT 0, d_t TEXT CHECK(d_t in ('D','T')) NOT NULL, raw_total NUMBER NOT NULL, total NUMBER NOT NULL, tendered_amount NUMBER NOT NULL, change NUMBER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
         CREATE TABLE IF NOT EXISTS add_on_receipts(order_id TEXT NOT NULL, receipt_id INTEGER NOT NULL, for INTEGER NOT NULL, add_ons_id TEXT NOT NULL, PRIMARY KEY (order_id, receipt_id));
        CREATE TABLE IF NOT EXISTS drinks(drinks_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "12oz" NUMBER DEFAULT 0, "16oz" NUMBER DEFAULT 0, "22oz" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS fries(fries_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, small NUMBER DEFAULT 0, medium NUMBER DEFAULT 0, large NUMBER DEFAULT 0, jumbo NUMBER DEFAULT 0, monster NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS cheesesticks(cheesestick_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "8pcs" NUMBER DEFAULT 0, "12pcs" NUMBER DEFAULT 0, "16pcs" NUMBER DEFAULT 0, "20pcs" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS snack_with_drinks(snack_with_drinks_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "with Fruit Juice" NUMBER DEFAULT 0, "with Milk Tea" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS siomai(siomai_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "3pcs" NUMBER DEFAULT 0, "6pcs" NUMBER DEFAULT 0, "9pcs" NUMBER DEFAULT 0, "12pcs" NUMBER DEFAULT 0, "15pcs" NUMBER DEFAULT 0, "20pcs" NUMBER DEFAULT 0, "30pcs" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS super_meals(super_meals_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "SM1 (3pcs siomai + 1 rice)" NUMBER NOT NULL, "SM2 (4pcs siomai + 1 rice)" NUMBER NOT NULL, "SM3 (6pcs siomai + 1 rice)" NUMBER NOT NULL );
        CREATE TABLE IF NOT EXISTS others(others_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, price NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS drink_add_ons(menu_name TEXT NOT NULL PRIMARY KEY, price NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS snack_add_ons(menu_name TEXT NOT NULL PRIMARY KEY, price NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS trial_table(name TEXT PRIMARY KEY UNIQUE, age NUMBER);
        `
        )
        .then(() => console.log("successs"))
        .catch((e) => console.log(e));

      menuJson["Drinks"].map((el) => {
        db.runAsync(
          `INSERT INTO drinks VALUES ("${el.id}", "${el.menu_name}", ${el.price["12oz"]}, ${el.price["16oz"]}, ${el.price["22oz"]})`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => console.log(e));
      });

      menuJson["Fries"].map((el) => {
        db.runAsync(
          `INSERT INTO fries VALUES ("${el.id}", "${el.menu_name}", ${el.price.small}, ${el.price.medium}, ${el.price.large}, ${el.price.jumbo}, ${el.price.monster})`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => console.log(e));
      });

      menuJson["Cheesestick"].map((el) => {
        db.runAsync(
          `INSERT INTO cheesesticks VALUES ("${el.id}", "${el.menu_name}", ${el.price["8pcs"]}, ${el.price["12pcs"]}, ${el.price["16pcs"]}, ${el.price["20pcs"]})`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => console.log(e));
      });

      menuJson["Snack with Drink"].map((el) => {
        db.runAsync(
          `INSERT INTO snack_with_drinks VALUES ("${el.id}", "${el.menu_name}", ${el.price["with Fruit Juice"]}, ${el.price["with Milk Tea"]})`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => console.log(e));
      });

      menuJson["Siomai"].map((el) => {
        db.runAsync(
          `INSERT INTO siomai VALUES ("${el.id}", "${el.menu_name}", ${el.price["3pcs"]}, ${el.price["6pcs"]}, ${el.price["9pcs"]}, ${el.price["12pcs"]}, ${el.price["15pcs"]}, ${el.price["20pcs"]}, ${el.price["30pcs"]})`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => console.log(e));
      });

      menuJson["Super Meal"].map((el) => {
        db.runAsync(
          `INSERT INTO super_meals VALUES ("${el.id}", "${el.menu_name}", ${el.price["SM1 (3pcs siomai + 1 rice)"]}, ${el.price["SM2 (4pcs siomai + 1 rice)"]}, ${el.price["SM3 (6pcs siomai + 1 rice)"]})`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => console.log(e));
      });

      menuJson["Others"].map((el) => {
        db.runAsync(
          `INSERT INTO others VALUES ("${el.id}", "${el.menu_name}", ${el.price})`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => console.log(e));
      });

      const drink_add_on = Object.keys(menuJson["Add On"][0].add_on);
      drink_add_on.map((el) => {
        db.runAsync(
          `INSERT INTO drink_add_ons VALUES ("${el}", ${
            menuJson["Add On"][0].add_on[
              el as keyof (typeof menuJson)["Add On"][0]["add_on"]
            ]
          })`
        )
          .then(() => console.log(el + " added"))
          .catch((e) => console.log(e));
      });

      const snack_add_on = Object.keys(menuJson["Add On"][1].add_on);
      snack_add_on.map((el) => {
        db.runAsync(
          `INSERT INTO snack_add_ons VALUES ("${el}", ${
            menuJson["Add On"][1].add_on[
              el as keyof (typeof menuJson)["Add On"][1]["add_on"]
            ]
          })`
        )
          .then(() => console.log(el + " added"))
          .catch((e) => console.log(e));
      });
    });
    // await db
    //   .execAsync(
    //     `
    //     DROP TABLE add_on_receipts;
    //     CREATE TABLE IF NOT EXISTS add_on_receipts(order_id TEXT NOT NULL, receipt_id INTEGER NOT NULL, for INTEGER NOT NULL, add_ons_id TEXT NOT NULL, PRIMARY KEY (order_id, receipt_id));
    //     `
    //   )
    //   .then(() => console.log("adjusted"));
    const res = await db.getAllAsync(`SELECT * FROM drinks`);
    console.log(res);

    console.log("ran");
  }

  useEffect(() => {
    logData();
  }, []);

  useEffect(() => {
    if (receipt.length > 0) {
      receipt.map((el) => {
        console.log(
          "add on for receipt number " + el.receipt.receipt_id + " : "
        );
        console.log(el.add_on);
      });
    }
  }, [receipt]);

  if (!fonts) {
    return <Text>Wait</Text>;
  }

  return (
    <SafeAreaView>
      <ReceiptContext.Provider
        value={{ receipt, add_receipt, remove_receipt, reset_receipt }}
      >
        <ImageBackground source={require("../assets/img/mango-pattern.jpg")}>
          <View style={style.container}>
            <ReceiptTab width={"40%"} checkout={true} editable={true} />
            <View style={[style.menuDiv, defaultStyles.big_shadow]}>
              <View style={style.menuButtonContainer}>
                <Text style={{ fontFamily: "Monument", fontSize: hp(4) }}>
                  Menu
                </Text>
                {default_menu.map((el, index) => {
                  return (
                    <MenuButton
                      menu_category_name={el.category}
                      bg_color={el.bg_color}
                      key={index}
                    />
                  );
                })}
              </View>
            </View>
          </View>
        </ImageBackground>
      </ReceiptContext.Provider>
    </SafeAreaView>
  );
}
