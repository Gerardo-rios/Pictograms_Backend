import mysql from "mysql2/promise";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

class Database {
  private static instance: mysql.Pool | null = null;

  private constructor () {
  }

  private static init (): mysql.Pool {
    return mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  public static getInstance (): mysql.Pool {
    if (!Database.instance) {
      Database.instance = Database.init();
    }
    return Database.instance;
  }
}

export default Database;
