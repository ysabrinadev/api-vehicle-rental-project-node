import { Request, Response } from "express";
import { VehicleController } from "../vehicleController";
import { VehicleModel } from "../../models/vehicleModel";
import { IVehicle } from "../../interfaces/IVehicle";

jest.mock("../../models/vehicleModel");

describe("Controlador de Veículos", () => {
    let vehicleController: VehicleController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockVehicleModel: jest.Mocked<VehicleModel>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        mockRequest = {
            params: {},
            body: {},
        };

        vehicleController = new VehicleController();
        mockVehicleModel = (vehicleController as any).model;
    });

    describe("getAllVehicles", () => {
        it("Deve retornar todos os veículos.", async () => {
            const mockVehicles: IVehicle[] = [
                {
                    Id: 1,
                    Placa: "ABC1D23",
                    Chassi: "9BWZZZ377VT004251",
                    Renavam: "12345678901",
                    Modelo: "Volkswagen Gol",
                    Ano: 2015,
                    DataCriacao: new Date(),
                    DataAtualizacao: new Date()
                },
            ];

            mockVehicleModel.findAll.mockResolvedValue(mockVehicles);

            await vehicleController.getAllVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith(mockVehicles);
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it("Deve tratar erros ao buscar veículos.", async () => {
            const error = new Error("Erro no banco de dados.");
            mockVehicleModel.findAll.mockRejectedValue(error);

            await vehicleController.getAllVehicles(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Não foi possível encontrar os veículos.",
                error: "Erro no banco de dados.",
            });
        });
    });

    describe("getVehicleById", () => {
        it("Deve retornar um veículo quando encontrado.", async () => {
            const mockVehicle: IVehicle = {
                Id: 1,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataCriacao: new Date(),
                DataAtualizacao: new Date()
            };

            mockRequest.params = { id: "2" };
            mockVehicleModel.findById.mockResolvedValue(mockVehicle);

            await vehicleController.getVehicleById(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith(mockVehicle);
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it("Deve retornar 404 quando o veículo não for encontrado.", async () => {
            mockRequest.params = { id: "999" };
            mockVehicleModel.findById.mockResolvedValue(null);

            await vehicleController.getVehicleById(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "O veículo não foi encontrado.",
            });
        });
    });

    describe("createVehicle", () => {
        it("Deve criar um novo veículo com sucesso.", async () => {
            const newVehicle: Omit<IVehicle, "Id"> = {
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
            };

            mockRequest.body = newVehicle;
            const createdVehicle: IVehicle = { Id: 1, ...newVehicle };
            mockVehicleModel.create.mockResolvedValue(createdVehicle);

            await vehicleController.createVehicle(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdVehicle);
        });

        it("Deve tratar erro de placa duplicada.", async () => {
            const newVehicle: Omit<IVehicle, "Id"> = {
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
            };

            mockRequest.body = newVehicle;
            mockVehicleModel.create.mockRejectedValue(
                new Error("Já existe um veículo cadastrado com esta placa.")
            );

            await vehicleController.createVehicle(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Erro ao cadastrar veículo.",
                error: "Já existe um veículo cadastrado com esta placa.",
            });
        });
    });

    describe("updateVehicle", () => {
        it("Deve atualizar um veículo com sucesso.", async () => {
            const updatedVehicle: IVehicle = {
                Id: 1,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataCriacao: new Date(),
                DataAtualizacao: new Date(),
            };

            mockRequest.params = { id: "1" };
            mockRequest.body = updatedVehicle;
            mockVehicleModel.update.mockResolvedValue(updatedVehicle);

            await vehicleController.updateVehicle(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.json).toHaveBeenCalledWith(updatedVehicle);
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it("Deve retornar 404 ao atualizar veículo inexistente.", async () => {
            mockRequest.params = { id: "999" };
            mockRequest.body = {
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
            };

            mockVehicleModel.update.mockResolvedValue(null);

            await vehicleController.updateVehicle(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "O veículo não foi encontrado.",
            });
        });
    });

    describe("deleteVehicle", () => {
        it("Deve deletar um veículo com sucesso.", async () => {
            mockRequest.params = { id: "1" };
            mockVehicleModel.delete.mockResolvedValue(true);

            await vehicleController.deleteVehicle(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it("Deve retornar 404 ao deletar veículo inexistente.", async () => {
            mockRequest.params = { id: "999" };
            mockVehicleModel.delete.mockResolvedValue(false);

            await vehicleController.deleteVehicle(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "O veículo não foi encontrado.",
            });
        });
    });
});
