module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',

  // Module Matching
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  roots: [
    '<rootDir>/packages/app/src',
    '<rootDir>/packages/ux/src',
    '<rootDir>/packages/test-config',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)spec)\\.tsx?$',

  // TS-Jest
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/packages/test-config/config/jest-setup-transform.js',
  },

  // Coverage report
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 60,
      statements: 60
    },
  },
  collectCoverageFrom: [
    '<rootDir>/packages/app/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/packages/ux/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/packages/ux/**/*.stories.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/packages/api/', '/__fixtures__/'],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  coverageDirectory: 'reports/coverage',

  // Map modules
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/packages/test-config/__mocks__/fileMock.js',
    '@sparkboom-sdms/test-config/__mocks__/redux-saga/delay': '<rootDir>/packages/test-config/__mocks__/redux-saga/delay.ts'
  },

  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: [
    '<rootDir>/packages/test-config/config/jest-setup.tsx'
  ],
  setupFilesAfterEnv: [
    'jest-extended',
    '<rootDir>/packages/test-config/config/jest-setup-postenv.ts'
  ],
};
// use  __mocks__
