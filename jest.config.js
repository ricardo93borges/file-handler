module.exports = {
  roots: ["<rootDir>/test"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  preset: "ts-jest",
  moduleNameMapper: {
    "@/test/(.*)": "<rootDir>/test/$1",
    "@/(.*)": "<rootDir>/src/$1",
  },
};
