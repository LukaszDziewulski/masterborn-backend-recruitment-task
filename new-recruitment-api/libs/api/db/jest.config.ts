const { createGlobPatternsForDependencies } = require("@nx/js");
const { join } = require("path");

module.exports = {
  displayName: "api-db",
  preset: "../../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/libs/api/db",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};
