import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import vehicleRoutes from "./routes/vehiclesRoutes";
import { morganMiddleware } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { apiLimiter } from "./middlewares/raterLimiter";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(morganMiddleware);

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/vehicles", vehicleRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/", apiLimiter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
