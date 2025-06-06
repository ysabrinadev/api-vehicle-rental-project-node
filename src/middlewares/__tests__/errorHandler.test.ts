import { Request, Response } from "express";
import { AppError, errorHandler } from "../errorHandler";

jest.mock("../logger", () => ({
    error: jest.fn(),
    info: jest.fn(),
}));

describe("Middleware de Tratamento de Erros", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;
    let originalConsoleError: typeof console.error;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
        originalConsoleError = console.error;
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    describe("AppError", () => {
        it("Deve criar um AppError com código de status padrão.", () => {
            const error = new AppError("Erro de teste.", 500);
            expect(error.message).toBe("Erro de teste.");
            expect(error.statusCode).toBe(500);
        });

        it("Deve criar um AppError com código de status personalizado.", () => {
            const error = new AppError("Não encontrado.", 404);
            expect(error.message).toBe("Não encontrado.");
            expect(error.statusCode).toBe(404);
        });
    });

    describe("errorHandler", () => {
        it("Deve tratar AppError com código de status personalizado.", () => {
            const error = new AppError("Não encontrado.", 404);
            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "fail",
                message: "Não encontrado.",
            });
        });

        it("Deve tratar AppError com código de status padrão.", () => {
            const error = new AppError("Erro interno do servidor.", 500);
            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "error",
                message: "Erro interno do servidor.",
            });
        });

        it("Deve tratar Error regular com código de status 500.", () => {
            const error = new Error("Erro inesperado.");
            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "error",
                message: "Ops! Algo não saiu como o esperado.",
            });
        });

        it("Deve tratar tipos de erro desconhecidos.", () => {
            const error = "Erro em string.";
            errorHandler(
                error as any,
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "error",
                message: "Ops! Algo não saiu como o esperado.",
            });
        });
    });
});
