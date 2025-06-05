import { z } from "zod";

export const vehicleSchema = z.object({
    Placa: z
        .string()
        .min(1, "Placa deve ter no mínimo 1 caracter.")
        .max(7, "Placa deve ter no máximo 7 caracteres.")
        .transform((str) => str.toUpperCase()),
    Chassi: z.string().max(17, "Chassi deve ter no máximo 17 caracteres."),
    Renavam: z.string().max(11, "Renavam deve ter no máximo 11 caracteres."),
    Modelo: z.string().max(100, "Modelo deve ter no máximo 100 caracteres."),
    Ano: z.number().max(4, "Ano deve ter no máximo 4 caracteres."),
});
