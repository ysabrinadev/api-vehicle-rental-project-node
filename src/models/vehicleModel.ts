import { IVehicle } from "../interfaces/IVehicle";

import { RowDataPacket } from "mysql2/promise";
import { VehicleRepository } from "../repositories/vehicleRepository";

export class VehicleModel {
  private repository: VehicleRepository;

  constructor() {
    this.repository = new VehicleRepository();
  }

  async findAll(): Promise<IVehicle[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<IVehicle | null> {
    return this.repository.findById(id);
  }

  async findByPlate(placa: string): Promise<IVehicle | null> {
    return this.repository.findByPlate(placa);
  }

  async create(vehicle: IVehicle): Promise<IVehicle> {
    const existingVehicle = await this.findByPlate(vehicle.Placa);
    if (existingVehicle) {
      throw new Error("Já existe um veículo cadastrado com essa placa.");
    }
    return this.repository.create(vehicle as Partial<IVehicle & RowDataPacket>);
  }

  async update(id: number, vehicle: IVehicle): Promise<IVehicle | null> {
    const existingVehicle = await this.findById(id);
    if (!existingVehicle) {
      throw new Error("O veículo não foi encontrado.");
    }

    if (vehicle.Placa !== existingVehicle.Placa) {
      const vehicleWithSamePlate = await this.findByPlate(vehicle.Placa);
      if (vehicleWithSamePlate) {
        throw new Error("Já existe um veículo cadastrado com essa placa.");
      }
    }

    return this.repository.update(
      id,
      vehicle as Partial<IVehicle & RowDataPacket>
    );
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  async updateAvailability(
    id: number,
    disponivel: boolean
  ): Promise<IVehicle | null> {
    return this.repository.updateAvailability(id, disponivel);
  }
}
