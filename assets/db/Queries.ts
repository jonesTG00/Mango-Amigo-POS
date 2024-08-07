import { SQLiteDatabase } from "expo-sqlite";
import * as Crypto from "expo-crypto";
import { Receipt } from "./types";
export async function recordReceipt(
  db: SQLiteDatabase,
  receipt_list: Receipt[]
) {
  const order_id = Crypto.randomUUID();
  let sum = 0;
  for (let index = 0; index < receipt_list.length; index++) {
    sum += receipt_list[index].total_price;
  }
}
