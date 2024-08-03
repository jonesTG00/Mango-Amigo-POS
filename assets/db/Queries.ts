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
