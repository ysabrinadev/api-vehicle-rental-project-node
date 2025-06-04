import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dataBase = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "vehicle-rental-database",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

dataBase
  .getConnection()
  .then((connection: mysql.PoolConnection) => {
    console.log("Banco de Dados conectado com sucesso!");
    connection.release();
  })
  .catch((err: Error) => {
    console.error("Erro ao conectar com o Banco de Dados:", err);
  });
export default dataBase;
