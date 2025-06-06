import { VehicleRepository } from "../vehicleRepository";
import { IVehicle } from "../../interfaces/IVehicle";
import { RowDataPacket } from "mysql2/promise";

jest.mock("../BaseRepository");

describe("Repositório de Veículos", () => {
    let vehicleRepository: VehicleRepository;
    let mockExecuteQuery: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        vehicleRepository = new VehicleRepository();
        mockExecuteQuery = (vehicleRepository as any).executeQuery;
    });

    describe("findByPlate", () => {
        it("Deve retornar um veículo quando encontrado pela placa.", async () => {
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

            mockExecuteQuery.mockResolvedValue([mockVehicle]);

            const result = await vehicleRepository.findByPlate("ABC1D23");

            expect(result).toEqual(mockVehicle);
            expect(mockExecuteQuery).toHaveBeenCalledWith(
                "SELECT * FROM vehicles WHERE Placa = ?",
                ["ABC1D23"]
            );
        });

        it("Deve retornar null quando nenhum veículo for encontrado pela placa.", async () => {
            mockExecuteQuery.mockResolvedValue([]);

            const result = await vehicleRepository.findByPlate("XYZ5678");

            expect(result).toBeNull();
            expect(mockExecuteQuery).toHaveBeenCalledWith(
                "SELECT * FROM vehicles WHERE Placa = ?",
                ["XYZ5678"]
            );
        });
    });

    describe("updateAvailability", () => {
        it("Deve atualizar a disponibilidade do veículo e retornar o veículo atualizado.", async () => {
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

            mockExecuteQuery.mockResolvedValueOnce([]);
            (vehicleRepository as any).findById.mockResolvedValue(mockVehicle);

            const result = await vehicleRepository.updateAvailability(1, false);

            expect(result).toEqual(mockVehicle);
            expect(mockExecuteQuery).toHaveBeenCalledWith(
                "UPDATE vehicles SET disponivel = ? WHERE id = ?",
                [false, 1]
            );
            expect((vehicleRepository as any).findById).toHaveBeenCalledWith(1);
        });
    });
});
