import baseConfig from './jest.config.base.js';

export default {
  ...baseConfig,
  displayName: 'INTEGRATION',
  testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
};