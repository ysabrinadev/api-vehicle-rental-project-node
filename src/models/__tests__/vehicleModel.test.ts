import { VehicleModel } from "../vehicleModel";
import { VehicleRepository } from "../../repositories/vehicleRepository";
import { IVehicle } from "../../interfaces/IVehicle";
import { RowDataPacket } from "mysql2/promise";

jest.mock("../../repositories/VehicleRepository");

describe("Modelo de Veículo", () => {
    let vehicleModel: VehicleModel;
    let mockVehicleRepository: jest.Mocked<VehicleRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        vehicleModel = new VehicleModel();
        mockVehicleRepository = (vehicleModel as any).repository;
    });

    describe("findAll", () => {
        it("Deve retornar todos os veículos.", async () => {
            const mockVehicles: (IVehicle & RowDataPacket)[] = [
                {
                    Id: 1,
                    Placa: "ABC1D23",
                    Chassi: "9BWZZZ377VT004251",
                    Renavam: "12345678901",
                    Modelo: "Volkswagen Gol",
                    Ano: 2015,
                    DataCriacao: new Date(),
                    DataAtualizacao: new Date(),
                } as IVehicle & RowDataPacket,
            ];

            mockVehicleRepository.findAll.mockResolvedValue(mockVehicles);

            const result = await vehicleModel.findAll();

            expect(result).toEqual(mockVehicles);
            expect(mockVehicleRepository.findAll).toHaveBeenCalled();
        });
    });

    describe("findById", () => {
        it("Deve retornar um veículo quando encontrado.", async () => {
            const mockVehicle: IVehicle & RowDataPacket = {
                Id: 1,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataCriacao: new Date(),
                DataAtualizacao: new Date(),
            } as IVehicle & RowDataPacket;

            mockVehicleRepository.findById.mockResolvedValue(mockVehicle);

            const result = await vehicleModel.findById(1);

            expect(result).toEqual(mockVehicle);
            expect(mockVehicleRepository.findById).toHaveBeenCalledWith(1);
        });

        it("Deve retornar null quando o veículo não for encontrado.", async () => {
            mockVehicleRepository.findById.mockResolvedValue(null);

            const result = await vehicleModel.findById(999);

            expect(result).toBeNull();
            expect(mockVehicleRepository.findById).toHaveBeenCalledWith(999);
        });
    });

    describe("create", () => {
        it("Deve criar um novo veículo com sucesso.", async () => {
            const newVehicle: Omit<IVehicle, "Id"> = {
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
            };

            const createdVehicle: IVehicle & RowDataPacket = {
                Id: 1,
                ...newVehicle,
            } as IVehicle & RowDataPacket;

            mockVehicleRepository.findByPlate.mockResolvedValue(null);
            mockVehicleRepository.create.mockResolvedValue(createdVehicle);

            const result = await vehicleModel.create(newVehicle as IVehicle);

            expect(result).toEqual(createdVehicle);
            expect(mockVehicleRepository.findByPlate).toHaveBeenCalledWith(
                newVehicle.Placa
            );
            expect(mockVehicleRepository.create).toHaveBeenCalledWith(newVehicle);
        });

        it("Deve emitir erro quando a placa já existir.", async () => {
            const newVehicle: Omit<IVehicle, "Id"> = {
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
            };

            const existingVehicle: IVehicle & RowDataPacket = {
                Id: 1,
                ...newVehicle,
                DataCriacao: new Date(),
                DataAtualizacao: new Date(),
            } as IVehicle & RowDataPacket;

            mockVehicleRepository.findByPlate.mockResolvedValue(existingVehicle);

            await expect(vehicleModel.create(newVehicle as IVehicle)).rejects.toThrow(
                "Já existe um veículo cadastrado com essa placa."
            );

            expect(mockVehicleRepository.findByPlate).toHaveBeenCalledWith(
                newVehicle.Placa
            );
            expect(mockVehicleRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("Deve atualizar um veículo com sucesso.", async () => {
            const existingVehicle: IVehicle & RowDataPacket = {
                Id: 1,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataCriacao: new Date(),
                DataAtualizacao: new Date(),
            } as IVehicle & RowDataPacket;

            const updatedVehicle: IVehicle & RowDataPacket = {
                ...existingVehicle,
                Modelo: "Corolla 2.0",
            } as IVehicle & RowDataPacket;

            mockVehicleRepository.findById.mockResolvedValue(existingVehicle);
            mockVehicleRepository.findByPlate.mockResolvedValue(null);
            mockVehicleRepository.update.mockResolvedValue(updatedVehicle);

            const result = await vehicleModel.update(1, updatedVehicle);

            expect(result).toEqual(updatedVehicle);
            expect(mockVehicleRepository.findById).toHaveBeenCalledWith(1);
            expect(mockVehicleRepository.update).toHaveBeenCalledWith(
                1,
                updatedVehicle
            );
        });

        it("Deve emitir erro quando o veículo não for encontrado.", async () => {
            const updatedVehicle: IVehicle & RowDataPacket = {
                Id: 1,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataCriacao: new Date(),
                DataAtualizacao: new Date(),
            } as IVehicle & RowDataPacket;

            mockVehicleRepository.findById.mockResolvedValue(null);

            await expect(vehicleModel.update(1, updatedVehicle)).rejects.toThrow(
                "O veículo não foi encontrado."
            );

            expect(mockVehicleRepository.findById).toHaveBeenCalledWith(1);
            expect(mockVehicleRepository.update).not.toHaveBeenCalled();
        });

        it("Deve emitir erro quando a placa já existir.", async () => {
            const existingVehicle: IVehicle & RowDataPacket = {
                Id: 1,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataCriacao: new Date(),
                DataAtualizacao: new Date(),
            } as IVehicle & RowDataPacket;

            const updatedVehicle: IVehicle & RowDataPacket = {
                ...existingVehicle,
                Placa: "XYZ5678",
            } as IVehicle & RowDataPacket;

            const vehicleWithNewPlate: IVehicle & RowDataPacket = {
                Id: 2,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataAtualizacao: new Date(),
            } as IVehicle & RowDataPacket;

            mockVehicleRepository.findById.mockResolvedValue(existingVehicle);
            mockVehicleRepository.findByPlate.mockResolvedValue(vehicleWithNewPlate);

            await expect(vehicleModel.update(1, updatedVehicle)).rejects.toThrow(
                "Já existe um veículo cadastrado com essa placa."
            );

            expect(mockVehicleRepository.findById).toHaveBeenCalledWith(1);
            expect(mockVehicleRepository.findByPlate).toHaveBeenCalledWith("XYZ5678");
            expect(mockVehicleRepository.update).not.toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        it("Deve deletar um veículo com sucesso.", async () => {
            mockVehicleRepository.delete.mockResolvedValue(true);

            const result = await vehicleModel.delete(1);

            expect(result).toBe(true);
            expect(mockVehicleRepository.delete).toHaveBeenCalledWith(1);
        });

        it("Deve retornar false quando o veículo não for encontrado.", async () => {
            mockVehicleRepository.delete.mockResolvedValue(false);

            const result = await vehicleModel.delete(999);

            expect(result).toBe(false);
            expect(mockVehicleRepository.delete).toHaveBeenCalledWith(999);
        });
    });

    describe("updateAvailability", () => {
        it("Deve atualizar a disponibilidade do veículo com sucesso.", async () => {
            const updatedVehicle: IVehicle & RowDataPacket = {
                Id: 1,
                Placa: "ABC1D23",
                Chassi: "9BWZZZ377VT004251",
                Renavam: "12345678901",
                Modelo: "Volkswagen Gol",
                Ano: 2015,
                DataCriacao: new Date(),
                DataAtualizacao: new Date(),
            } as IVehicle & RowDataPacket;

            mockVehicleRepository.updateAvailability.mockResolvedValue(
                updatedVehicle
            );

            const result = await vehicleModel.updateAvailability(1, false);

            expect(result).toEqual(updatedVehicle);
            expect(mockVehicleRepository.updateAvailability).toHaveBeenCalledWith(
                1,
                false
            );
        });
    });
});
