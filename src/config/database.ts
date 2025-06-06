import mysql, { PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "vehicle_rental_database",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: isTest ? 1 : 10,
  queueLimit: 0,
  charset: "utf8",
  timezone: "Z",
};

const dataBase = mysql.createPool(poolConfig);

if (!isTest) {
  dataBase
    .getConnection()
    .then((connection) => {
      console.log("Banco de Dados conectado com sucesso!");
      connection.release();
    })
    .catch((err) => {
      console.error("Erro ao conectar com o Banco de Dados:", err);
    });
}

const cleanup = async () => {
  try {
    await dataBase.end();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

export default dataBase;
