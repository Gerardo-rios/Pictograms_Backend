import Database from "../config/db/db";

async function queryDB (query: string, values: Array<string | number>) {
  const db = Database.getInstance();
  const conn = await db.getConnection();
  const [rows] = await conn.query(query, values);
  conn.release();
  return rows;
}

export default queryDB;
