import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";

const router = Router();
const vehicleController = new VehicleController();

router.get('/', vehicleController.getAllVehicles.bind(vehicleController));
router.get("/:id", vehicleController.getVehicleById.bind(vehicleController));
router.post("/", vehicleController.createVehicle.bind(vehicleController));
router.put("/:id", vehicleController.updateVehicle.bind(vehicleController));
router.delete("/:id", vehicleController.deleteVehicle.bind(vehicleController));

export default router;
