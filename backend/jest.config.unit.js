import baseConfig from './jest.config.base.js';

export default {
  ...baseConfig,
  displayName: 'UNIT',
  testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
  moduleNameMapper: {
    '^better-sqlite3$': '<rootDir>/tests/unit/__mocks__/better-sqlite3.js'
  }
};