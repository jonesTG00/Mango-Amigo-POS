import { SafeAreaView } from "react-native";

import * as React from "react";
import * as Orientation from "expo-screen-orientation";

import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { SQLiteProvider } from "expo-sqlite";
import Landing from "../components/Landing";

export default function App() {
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

  Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE);

  useEffect(() => {
    loadDB();
  }, []);

  return (
    <SQLiteProvider databaseName="MangoAmigoPOS">
      <SafeAreaView>
        <Landing />
      </SafeAreaView>
    </SQLiteProvider>
  );
}
