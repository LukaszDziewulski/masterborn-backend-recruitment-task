const { createGlobPatternsForDependencies } = require("@nx/js");
const { join } = require("path");

module.exports = {
  displayName: "recruitment-api",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/apps/recruitment-api",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  globals: {},
  globalSetup: undefined,
  globalTeardown: undefined,
};
