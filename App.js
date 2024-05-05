import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import Home from "./Home";

//sql
import { SQLiteProvider } from "expo-sqlite/next";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { useSQLiteContext } from "expo-sqlite/next";

//sql function
const loadDatabase = async () => {
  const dbName = "Questions.db";
  const dbAsset = require("./assets/Questions.db");
  const dbUri = Asset.fromModule(dbAsset).uri;

  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

const App = () => {
  //sql calling
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
      </View>
    );

  return (
    <SQLiteProvider databaseName="Questions.db">
      <Home />
    </SQLiteProvider>
  );
};

export default App;
