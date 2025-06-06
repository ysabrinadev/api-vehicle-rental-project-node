module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/server.ts",
        "!src/interfaces/**/*.ts",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "clover"],
    verbose: true,
};
