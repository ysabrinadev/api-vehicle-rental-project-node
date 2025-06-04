import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import dataBase from "../config/database";

export abstract class BaseRepository<T extends RowDataPacket> {
    protected dataBase: Pool;
    protected tableName: string;

    constructor(tableName: string) {
        this.dataBase = dataBase;
        this.tableName = tableName;
    }

    protected async executeQuery<R>(
        query: string,
        params: any[] = []
    ): Promise<R> {
        try {
            const [result] = await this.dataBase.execute(query, params);
            return result as R;
        } catch (error) {
            console.error(`Erro ao executar a requisição: ${query}`, error);
            throw new Error(
                `Erro do Banco de Dados: ${error instanceof Error ? error.message : "Erro desconhecido."
                }`
            );
        }
    }

    async findAll(): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableName}`;
        return this.executeQuery<T[]>(query);
    }

    async findById(id: number): Promise<T | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const results = await this.executeQuery<T[]>(query, [id]);
        return results[0] || null;
    }

    async create(data: Partial<T>): Promise<T> {
        const columns = Object.keys(data).join(", ");
        const placeholders = Object.keys(data)
            .map(() => "?")
            .join(", ");
        const values = Object.values(data);

        const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
        const result = await this.executeQuery<ResultSetHeader>(query, values);

        return this.findById(result.insertId) as Promise<T>;
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        const setClause = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");
        const values = [...Object.values(data), id];

        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
        await this.executeQuery<ResultSetHeader>(query, values);

        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const result = await this.executeQuery<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    }
}
