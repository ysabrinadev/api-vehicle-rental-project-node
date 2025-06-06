import { Request, Response } from "express";
import { morganMiddleware } from "../logger";

jest.mock("winston", () => {
    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        add: jest.fn(),
    };

    return {
        createLogger: () => mockLogger,
        format: {
            combine: jest.fn().mockReturnValue({}),
            timestamp: jest.fn().mockReturnValue({}),
            json: jest.fn().mockReturnValue({}),
            simple: jest.fn().mockReturnValue({}),
        },
        transports: {
            Console: jest.fn().mockImplementation(() => ({
                format: {},
            })),
            File: jest.fn().mockImplementation(() => ({
                format: {},
            })),
        },
    };
});

const mockLogger = require("winston").createLogger();

describe("Middleware de Logger", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            method: "GET",
            url: "/test",
            ip: "127.0.0.1",
        };
        mockResponse = {
            statusCode: 200,
            on: jest.fn(),
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    it("Deve registrar a requisição em ambiente de desenvolvimento.", () => {
        process.env.NODE_ENV = "development";
        morganMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
    });

    it("Deve registrar a requisição em ambiente de produção.", () => {
        process.env.NODE_ENV = "production";
        morganMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
    });

    it("Não deve adicionar o transport de console em ambiente de produção", () => {
        process.env.NODE_ENV = "production";
        morganMiddleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockLogger.add).not.toHaveBeenCalled();
    });
});
