import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "./errorHandler";

export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessage = error.errors.map((err) => err.message).join(", ");
                return next(new AppError(errorMessage, 400));
            }
            next(error);
        }
    };
};
