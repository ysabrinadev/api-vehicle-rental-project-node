import { Request, Response } from "express";
import { VehicleModel } from "../models/vehicleModel";
import { IVehicle } from "../interfaces/IVehicle";

export class VehicleController {
    private model: VehicleModel;

    constructor() {
        this.model = new VehicleModel
    };

    async getAllVehicles(request: Request, response: Response): Promise<void> {
        try {
            const vehicles = await this.model.findAll();
            response.json(vehicles);
        }
        catch (error) {
            response.status(500).json({
                message: "Não foi possível encontrar os veículos.",
                error: error instanceof Error ? error.message : "Erro desconhecido."
            });
        }
    }

    async getVehicleById(request: Request, response: Response): Promise<void> {
        try {
            const id = parseInt(request.params.id);
            const vehicle = await this.model.findById(id);

            if (!vehicle) {
                response.status(404).json({ message: "O veículo não foi encontrado." });
                return;
            }

            response.json(vehicle);
        } catch (error) {
            response.status(500).json({
                message: "Erro ao encontrar o veículo.",
                error: error instanceof Error ? error.message : "Erro desconhecido.",
            });
        }
    }

    async createVehicle(request: Request, response: Response): Promise<void> {
        try {
            const vehicle: IVehicle = request.body;
            const newVehicle = await this.model.create(vehicle);

            response.status(201).json(newVehicle);
        } catch (error) {
            if (error instanceof Error && error.message.includes("already exists")) {
                response.status(409).json({
                    message: "Já existe um veículo cadastrado com esta placa.",
                    error: error.message,
                });
            } else {
                response.status(500).json({
                    message: "Erro ao cadastrar veículo.",
                    error: error instanceof Error ? error.message : "Erro desconhecido.",
                });
            }
        }
    }

    async updateVehicle(request: Request, response: Response): Promise<void> {
        try {
            const id = parseInt(request.params.id);
            const vehicle: IVehicle = request.body;

            const updatedVehicle = await this.model.update(id, vehicle);

            if (!updatedVehicle) {
                response.status(404).json({ message: "O veículo não foi encontrado." });
                return;
            }

            response.json(updatedVehicle);
        } catch (error) {
            response.status(500).json({
                message: "Erro ao atualizar os dados do veículo.",
                error: error instanceof Error ? error.message : "Erro desconhecido.",
            });
        }
    }

    async deleteVehicle(request: Request, response: Response): Promise<void> {
        try {
            const id = parseInt(request.params.id);
            const success = await this.model.delete(id);

            if (!success) {
                response.status(404).json({ message: "O veículo não foi encontrado." });
                return;
            }

            response.status(204).send();
        } catch (error) {
            response.status(500).json({
                message: "Erro ao remover o veículo.",
                error: error instanceof Error ? error.message : "Erro desconhecido.",
            });
        }
    }
};
