import { Router } from "express";
import { VehicleController } from "../controllers/vehicleController";

const router = Router();
const vehicleController = new VehicleController();

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Retorna todos os veículos.
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: Lista de veículos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get("/", vehicleController.getAllVehicles.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Retorna um veículo específico.
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *     responses:
 *       200:
 *         description: Veículo encontrado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Veículo não encontrado.
 */
router.get("/:id", vehicleController.getVehicleById.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Cria um novo veículo.
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Veículo cadastrado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Dados inválidos.
 */
router.post("/", vehicleController.createVehicle.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Atualiza um veículo existente.
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Veículo não encontrado.
 */
router.put("/:id", vehicleController.updateVehicle.bind(vehicleController));

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Remove um veículo.
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo.
 *     responses:
 *       204:
 *         description: Veículo removido com sucesso!
 *       404:
 *         description: Veículo não encontrado.
 */
router.delete("/:id", vehicleController.deleteVehicle.bind(vehicleController));

export default router;
