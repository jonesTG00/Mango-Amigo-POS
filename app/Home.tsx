import * as Orientation from "expo-screen-orientation";

import { Asset } from "expo-asset";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Link } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as React from "react";
import MenuButton from "../components/MenuCategoryButton";
import { AddOnReceipt, OrderSummary, Receipt } from "../assets/db/types";
import { useFonts } from "expo-font";
import defaultStyles, {
  MENU_CATEGORY_NAME,
  ReceiptImagesURI,
} from "../assets/defaults";
import ReceiptTab from "../components/ReceiptTab";
import { createContext, useEffect, useState } from "react";
import menuJson from "../assets/db/menuItems.json";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../assets/screentypes";
import Operation from "../components/Operation";

type Props = NativeStackScreenProps<StackParamList, "Home">;
export default function App({ route, navigation }: Props) {
  const [fonts] = useFonts({
    Monument: require("../assets/fonts/Monument Extended.otf"),
    Poppins: require("../assets/fonts/Poppins.ttf"),
  });

  const styles = StyleSheet.create({
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
    operationsButton: {
      width: hp(5),
      height: hp(5),
      borderRadius: hp(2.5),
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
    await db.getAllAsync(`SELECT * FROM drinks;`).catch(async () => {
      console.log("creating");

      await db
        .execAsync(
          `
        CREATE TABLE IF NOT EXISTS receipts(receipt_id NUMBER NOT NULL, order_id TEXT NOT NULL, type TEXT NOT NULL, item_id TEXT NOT NULL, specifications TEXT NOT NULL, quantity NUMBER DEFAULT 1, add_on_price NUMBER DEFAULT 0, item_price NUMBER NOT NULL, total_price NUMBER NOT NULL, receipt_description TEXT NOT NULL, PRIMARY KEY (receipt_id, order_id));
        CREATE TABLE IF NOT EXISTS order_summary(order_id NUMBER PRIMARY KEY NOT NULL, mode_of_payment TEXT CHECK (mode_of_payment IN ('GCASH', 'MAYA', "CASH")) NOT NULL, discount_percentage NUMBER DEFAULT 0, discount_cash NUMBER DEFAULT 0, d_t TEXT CHECK(d_t in ('D','T')) NOT NULL, raw_total NUMBER NOT NULL, total NUMBER NOT NULL, tendered_amount NUMBER NOT NULL, change NUMBER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS add_on_receipts(order_id TEXT NOT NULL, receipt_id NUMBER NOT NULL, for NUMBER NOT NULL, add_ons_id TEXT NOT NULL, PRIMARY KEY (order_id, receipt_id));
        CREATE TABLE IF NOT EXISTS drinks(drinks_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "12oz" NUMBER DEFAULT 0, "16oz" NUMBER DEFAULT 0, "22oz" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS fries(fries_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, small NUMBER DEFAULT 0, medium NUMBER DEFAULT 0, large NUMBER DEFAULT 0, jumbo NUMBER DEFAULT 0, monster NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS cheesesticks(cheesestick_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "8pcs" NUMBER DEFAULT 0, "12pcs" NUMBER DEFAULT 0, "16pcs" NUMBER DEFAULT 0, "20pcs" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS snack_with_drinks(snack_with_drinks_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "with Fruit Juice" NUMBER DEFAULT 0, "with Milk Tea" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS siomai(siomai_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "3pcs" NUMBER DEFAULT 0, "6pcs" NUMBER DEFAULT 0, "9pcs" NUMBER DEFAULT 0, "12pcs" NUMBER DEFAULT 0, "15pcs" NUMBER DEFAULT 0, "20pcs" NUMBER DEFAULT 0, "30pcs" NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS super_meals(super_meals_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, "SM1 (3pcs siomai + 1 rice)" NUMBER NOT NULL, "SM2 (4pcs siomai + 1 rice)" NUMBER NOT NULL, "SM3 (6pcs siomai + 1 rice)" NUMBER NOT NULL );
        CREATE TABLE IF NOT EXISTS others(others_id TEXT PRIMARY KEY NOT NULL, menu_name TEXT NOT NULL, price NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS refunds(refund_id NUMBER PRIMARY KEY NOT NULL, order_id NUMBER NOT NULL, refunded_amount NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS drink_add_ons(menu_name TEXT NOT NULL PRIMARY KEY, price NUMBER DEFAULT 0);
        CREATE TABLE IF NOT EXISTS snack_add_ons(menu_name TEXT NOT NULL PRIMARY KEY, price NUMBER DEFAULT 0);
        `
        )
        .then(() => console.log("table creation ran"))
        .catch((e) => console.log(e));

      menuJson["Drinks"].map((el) => {
        db.runAsync(
          `INSERT INTO drinks VALUES ("${el.id}", "${el.menu_name}", ${el.price["12oz"]}, ${el.price["16oz"]}, ${el.price["22oz"]});`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el.menu_name);
          });
      });

      menuJson["Fries"].map((el) => {
        db.runAsync(
          `INSERT INTO fries VALUES ("${el.id}", "${el.menu_name}", ${el.price.small}, ${el.price.medium}, ${el.price.large}, ${el.price.jumbo}, ${el.price.monster});`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el.menu_name);
          });
      });

      menuJson["Cheesestick"].map((el) => {
        db.runAsync(
          `INSERT INTO cheesesticks VALUES ("${el.id}", "${el.menu_name}", ${el.price["8pcs"]}, ${el.price["12pcs"]}, ${el.price["16pcs"]}, ${el.price["20pcs"]});`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el.menu_name);
          });
      });

      menuJson["Snack with Drink"].map((el) => {
        db.runAsync(
          `INSERT INTO snack_with_drinks VALUES ("${el.id}", "${el.menu_name}", ${el.price["with Fruit Juice"]}, ${el.price["with Milk Tea"]});`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el.menu_name);
          });
      });

      menuJson["Siomai"].map((el) => {
        db.runAsync(
          `INSERT INTO siomai VALUES ("${el.id}", "${el.menu_name}", ${el.price["3pcs"]}, ${el.price["6pcs"]}, ${el.price["9pcs"]}, ${el.price["12pcs"]}, ${el.price["15pcs"]}, ${el.price["20pcs"]}, ${el.price["30pcs"]});`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el.menu_name);
          });
      });

      menuJson["Super Meal"].map((el) => {
        db.runAsync(
          `INSERT INTO super_meals VALUES ("${el.id}", "${el.menu_name}", ${el.price["SM1 (3pcs siomai + 1 rice)"]}, ${el.price["SM2 (4pcs siomai + 1 rice)"]}, ${el.price["SM3 (6pcs siomai + 1 rice)"]});`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el.menu_name);
          });
      });

      menuJson["Others"].map((el) => {
        db.runAsync(
          `INSERT INTO others VALUES ("${el.id}", "${el.menu_name}", ${el.price});`
        )
          .then(() => console.log(el.menu_name + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el.menu_name);
          });
      });

      const drink_add_on = Object.keys(menuJson["Add On"][0].add_on);
      drink_add_on.map((el) => {
        db.runAsync(
          `INSERT INTO drink_add_ons VALUES ("${el}", ${
            menuJson["Add On"][0].add_on[
              el as keyof (typeof menuJson)["Add On"][0]["add_on"]
            ]
          });`
        )
          .then(() => console.log(el + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el);
          });
      });

      const snack_add_on = Object.keys(menuJson["Add On"][1].add_on);
      snack_add_on.map((el) => {
        db.runAsync(
          `INSERT INTO snack_add_ons VALUES ("${el}", ${
            menuJson["Add On"][1].add_on[
              el as keyof (typeof menuJson)["Add On"][1]["add_on"]
            ]
          });`
        )
          .then(() => console.log(el + " added"))
          .catch((e) => {
            console.log(e);
            console.log("error in " + el);
          });
      });
    });
    // await db
    //   .execAsync(
    //     `
    //       DROP TABLE receipts;
    //       DROP TABLE order_summary;
    //       DROP TABLE add_on_receipts;
    //       DROP TABLE drinks;
    //       DROP TABLE fries;
    //       DROP TABLE cheesesticks;
    //       DROP TABLE snack_with_drinks;
    //       DROP TABLE siomai;
    //       DROP TABLE super_meals;
    //       DROP TABLE others;
    //       DROP TABLE drink_add_ons;
    //       DROP TABLE snack_add_ons;
    //       `
    //   )
    //   .then(() => console.log("deleted"))
    //   .catch((e) => console.log(e))
    //   .then(() => {
    //     console.log("table deletion ran");
    //   });
    // const res = await db.getAllAsync(`SELECT * FROM drinks`);
    // console.log(res);

    console.log("ran");
  }

  useEffect(() => {
    logData();
  }, []);

  Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE);

  if (!fonts) {
    return <Text>Wait</Text>;
  }

  return (
    <SafeAreaView>
      <ImageBackground source={require("../assets/img/mango-pattern.jpg")}>
        <View style={styles.container}>
          <ReceiptTab width={"40%"} checkout={true} editable={true} />
          <View style={[styles.menuDiv, defaultStyles.big_shadow]}>
            <View style={styles.menuButtonContainer}>
              <Text style={{ fontFamily: "Monument", fontSize: hp(2) }}>
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
            {/* <TouchableOpacity
              style={[styles.operationsButton, { backgroundColor: "#FFC1CC" }]}
              onPress={() => {
                navigation.navigate("Receipts");
              }}
            >
              <Text>View Orders</Text>
            </TouchableOpacity> */}
            <Operation
              operation_name={"View Orders"}
              icon_source={"Receipt"}
              onPress={() => navigation.navigate("Receipts")}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
