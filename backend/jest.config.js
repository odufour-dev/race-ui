export default {
  rootDir: './',  
  moduleNameMapper: {
    '^better-sqlite3$': '<rootDir>/tests/__mocks__/better-sqlite3.js'
  },
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {},
  collectCoverageFrom: [
      "<rootDir>src/**/*.js"
    ]
};