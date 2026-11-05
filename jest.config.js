/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    // Mock para importações de CSS, para que o Jest não tente interpretá-las
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Stub para importações de assets estáticos (ex.: spritemap SVG do Clay)
    "\\.svg$": "<rootDir>/src/__mocks__/fileMock.cjs",
  },
  // Ignora a pasta node_modules, exceto o pacote @clayui/core que precisa ser transformado
  transformIgnorePatterns: ["/node_modules/(?!@clayui/core)"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          // Mesmo JSX transform do app (tsconfig.app.json), dispensa importar React
          jsx: "react-jsx",
          // Tipos do Vite para importações de assets (ex.: arquivos .svg)
          types: ["jest", "vite/client"],
        },
      },
    ],
  },
};
