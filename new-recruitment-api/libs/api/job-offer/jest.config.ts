export default {
  displayName: "api-job-offer",
  preset: "../../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/libs/api/job-offer",
  moduleNameMapper: {
    "^@recruitment-api/db$": "<rootDir>/../db/src/index.ts",
    "^@recruitment-api/job-offer$": "<rootDir>/src/index.ts",
  },
};
