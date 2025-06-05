import { RowDataPacket } from "mysql2";
import { IVehicle } from "../interfaces/IVehicle";
import { BaseRepository } from "./baseRepository";

export class VehicleRepository extends BaseRepository<IVehicle & RowDataPacket> {
  constructor() {
    super("vehicles");
  }

  async findByPlate(placa: string): Promise<IVehicle | null> {
    const query = "SELECT * FROM vehicles WHERE placa = ?";
    const results = await this.executeQuery<(IVehicle & RowDataPacket)[]>(
      query,
      [placa]
    );
    return results[0] || null;
  }

  async updateAvailability(
    id: number,
    disponivel: boolean
  ): Promise<IVehicle | null> {
    const query = "UPDATE vehicles SET disponivel = ? WHERE id = ?";
    await this.executeQuery(query, [disponivel, id]);
    return this.findById(id);
  }
}
