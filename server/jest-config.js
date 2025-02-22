module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript files
  testEnvironment: 'node', // Use the Node environment for backend tests
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Match test files with .test.ts or .spec.ts extensions
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform .ts and .tsx files using ts-jest
  },
};