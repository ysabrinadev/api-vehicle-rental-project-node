import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import logger from "./logger";

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler: ErrorRequestHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        logger.error(`AppError: ${err.message}`, {
            statusCode: err.statusCode,
            status: err.status,
            stack: err.stack,
        });

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        return;
    }

    logger.error("Erro inesperado.", {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
    });

    res.status(500).json({
        status: "error",
        message: "Ops! Algo não saiu como o esperado.",
    });
};
