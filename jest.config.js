/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    // Mock para importações de CSS, para que o Jest não tente interpretá-las
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  // Ignora a pasta node_modules, exceto o pacote @clayui/core que precisa ser transformado
  transformIgnorePatterns: ["/node_modules/(?!@clayui/core)"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          jsx: "react",
        },
      },
    ],
  },
};
