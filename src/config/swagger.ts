import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Vehicle Rental Project API",
            version: "1.0.0",
            description: "RESTful API for Vehicle Rental System",
            contact: {
                name: "Suporte",
                email: "suporte@exemplo.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de Desenvolvimento",
            },
        ],
        components: {
            schemas: {
                Vehicle: {
                    type: "object",
                    required: ["Placa", "Chassi", "Renavam", "Modelo", "Ano"],
                    properties: {
                        Id: {
                            type: "number",
                            format: "uuid",
                        },
                        Placa: {
                            type: "string",
                            description: "Placa do veículo.",
                        },
                        Chassi: {
                            type: "string",
                            description: "Número do chassi do veículo.",
                        },
                        Renavam: {
                            type: "string",
                            description: "Número do RENAVAM do veículo.",
                        },
                        Modelo: {
                            type: "string",
                            description: "Modelo do veículo.",
                        },
                        Ano: {
                            type: "number",
                            description: "Ano do veículo",
                        },
                        DataCriacao: {
                            type: "string",
                            format: "date-time",
                            description: "Data de criação do registro.",
                        },
                        DataAtualizacao: {
                            type: "string",
                            format: "date-time",
                            description: "Data da última atualização do registro.",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensagem de erro.",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
