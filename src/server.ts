import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import vehicleRoutes from "./routes/vehicles-routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/api/vehicles`);
});
