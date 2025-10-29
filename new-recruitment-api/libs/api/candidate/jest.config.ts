export default {
  displayName: "api-candidate",
  preset: "../../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/libs/api/candidate",
  moduleNameMapper: {
    "^@recruitment-api/db$": "<rootDir>/../db/src/index.ts",
    "^@recruitment-api/candidate$": "<rootDir>/src/index.ts",
  },
};
