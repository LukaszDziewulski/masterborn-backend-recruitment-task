const { createGlobPatternsForDependencies } = require('@nx/js');

module.exports = {
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageReporters: ['html', 'text', 'lcov'],
    collectCoverageFrom: [
        '**/*.ts',
        '!**/*.spec.ts',
        '!**/*.test.ts',
        '!**/node_modules/**',
        '!**/dist/**',
    ],
    testEnvironment: 'node',
};
