import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";

import * as React from "react";
import MenuButton from "../components/MenuCategoryButton";
import * as Orientation from "expo-screen-orientation";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { Receipt } from "../assets/db/types";
import { useFonts } from "expo-font";
import defaultStyles, { MENU_CATEGORY_NAME } from "../assets/defaults";
import ReceiptTab from "../components/ReceiptTab";
import { useEffect, useState } from "react";
import {connect} from '../assets/db/Queries'
import * as SQLite from 'expo-sqlite';

export default function App() {
  const db: Promise<SQLite.SQLiteDatabase> = connect()
  
  useEffect(()=>{
     async function createNeededTables(){
      (await db).execAsync(
        `CREATE TABLE IF NOT EXISTS receipt(receipt_id TEXT PRIMARY KEY NOT NULL, order_id TEXT NOT NULL, type TEXT NOT NULL, item_id TEXT NOT NULL, specifications TEXT NOT NULL, quantity INTEGER DEFAULT 1, add_on_price INTEGER DEFAULT 0, item_price INTEGER NOT NULL, total_price INTEGER NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS order_summary(order_id TEXT PRIMARY KEY NOT NULL, mode_of_payment TEXT CHECK (mode_of_payment IN ('GCASH', 'MAYA', "CASH")) NOT NULL, discount_percentage INTEGER DEFAULT 0, discount_cash INTEGER DEFAULT 0, d_t TEXT CHECK(d_t in ('D','T')) NOT NULL, raw_total NUMBER NOT NULL, total NUMBER NOT NULL, tendered_amount NUMBER NOT NULL, change NUMBER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
      )
      .then(()=>console.log("table created")).catch((e)=>console.log(e));
    }
      createNeededTables()
  },[])
  const [fonts] = useFonts({
    Monument: require("../assets/fonts/Monument Extended.otf"),
  });
  Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE);

  const [receipt, setReceipt] = useState<
    { receipt: Receipt; menu_name: string }[]
  >([]);

  function add_receipt(item: { receipt: Receipt; menu_name: string }[]) {
    setReceipt([...receipt, ...item]);
  }

  function remove_receipt(id: string) {
    const newArray = [...receipt];
    const index = newArray.findIndex((item) => item.receipt.receipt_id === id);
    newArray.splice(index, 1);
    setReceipt(newArray);
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

  if (!fonts) {
    return <Text>Wait</Text>;
  }
  return (
    <SafeAreaView>
      <ImageBackground source={require("../assets/img/mango-pattern.jpg")}>
        <View style={style.container}>
          <ReceiptTab
            width={"40%"}
            receipt_list={receipt}
            remove_from_receipt={remove_receipt} 
            checkout={true}/>
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
                    add_receipt={add_receipt}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
