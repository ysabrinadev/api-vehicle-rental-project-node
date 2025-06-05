import helmet from "helmet";
import cors from "cors";

export const securityMiddleware = [
    helmet(),
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
];
