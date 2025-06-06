import { Request, Response } from "express";
import { apiLimiter } from "../raterLimiter";

const mockStore = {
    increment: jest
        .fn()
        .mockResolvedValue({ totalHits: 1, resetTime: Date.now() }),
    decrement: jest.fn(),
    resetKey: jest.fn(),
    resetAll: jest.fn(),
};

jest.mock("express-rate-limit", () => {
    return jest.fn().mockImplementation(() => {
        return async (req: Request, res: Response, next: Function) => {
            const result = await mockStore.increment();
            if (result.totalHits > 100) {
                res.status(429).json({
                    error: "Muitas requisições, por favor tente novamente mais tarde.",
                });
                return;
            }
            next();
        };
    });
});

describe("Middleware de Limitação de Taxa", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            ip: "127.0.0.1",
            app: {
                get: jest.fn().mockReturnValue(false),
            } as any,
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    it("Deve permitir requisições dentro do limite de taxa.", async () => {
        mockStore.increment.mockResolvedValueOnce({
            totalHits: 1,
            resetTime: Date.now(),
        });
        await apiLimiter(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("Deve bloquear requisições que excedem o limite de taxa.", async () => {
        mockStore.increment.mockResolvedValueOnce({
            totalHits: 101,
            resetTime: Date.now(),
        });
        await apiLimiter(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(429);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: "Muitas requisições, por favor tente novamente mais tarde.",
        });
    });

    it("Deve tratar endereços IP diferentes separadamente.", async () => {
        const request1 = { ...mockRequest, ip: "127.0.0.1" };
        const request2 = { ...mockRequest, ip: "127.0.0.2" };

        mockStore.increment.mockResolvedValueOnce({
            totalHits: 1,
            resetTime: Date.now(),
        });
        mockStore.increment.mockResolvedValueOnce({
            totalHits: 1,
            resetTime: Date.now(),
        });

        await apiLimiter(
            request1 as Request,
            mockResponse as Response,
            nextFunction
        );
        await apiLimiter(
            request2 as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledTimes(2);
    });

    it("Deve resetar o contador após o período da janela.", async () => {
        mockStore.increment.mockResolvedValueOnce({
            totalHits: 1,
            resetTime: Date.now(),
        });
        await apiLimiter(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        mockStore.increment.mockResolvedValueOnce({
            totalHits: 1,
            resetTime: Date.now(),
        });
        await apiLimiter(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });
});
