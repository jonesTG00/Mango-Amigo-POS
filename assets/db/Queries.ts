// export async function getOne<T extends RowDataPacket>(
//     toReturn: string,
//     table: string,
//     uniqueColumn: string,
//     unique: string | number
//   ): Promise<T | undefined> {
//     try {
//       const [rows] = await pool.query<[T]>(
//         `SELECT ${toReturn} FROM ${table} WHERE ${uniqueColumn} = ? LIMIT 1`,
//         [unique]
//       );
//       return rows[0];
//     } catch (error) {
//       console.log(error);
//     }
//   }
import * as SQLite from 'expo-sqlite';
import { useEffect } from "react";

// you would have to import / invoke this in another file
export async function connect(): Promise<SQLite.SQLiteDatabase>{
    return await SQLite.openDatabaseAsync('database.db')
}

export function AddReceipt(){

}
