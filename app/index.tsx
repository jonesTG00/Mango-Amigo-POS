import { createContext, useEffect, useState } from "react";
import { Receipt, AddOnReceipt } from "../assets/db/types";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import menuJson from "../assets/db/menuItems.json";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Receipts from "./receipts";
import { StackParamList } from "../assets/screentypes";

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
export default function index() {
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

  const loadDB = async () => {
    const dbName = "MangoAmigoPOS.db";
    const dbAsset = require("../assets/db/MangoAmigoPOS.db");
    const dbURI = Asset.fromModule(dbAsset).uri;
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    const file = await FileSystem.getInfoAsync(dbFilePath);
    if (!file.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        { intermediates: true }
      );
      await FileSystem.downloadAsync(dbURI, dbFilePath);
    }
  };
  useEffect(() => {
    loadDB();
  }, []);

  const Stack = createNativeStackNavigator<StackParamList>();

  return (
    <ReceiptContext.Provider
      value={{ receipt, add_receipt, remove_receipt, reset_receipt }}
    >
      <SQLiteProvider databaseName="MangoAmigoPOS">
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Receipts" component={Receipts} />
        </Stack.Navigator>
      </SQLiteProvider>
    </ReceiptContext.Provider>
  );
}
