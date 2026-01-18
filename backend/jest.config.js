// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/docs/**',
    '!src/config/**',
    '!src/models/index.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testSetup.js'],
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Configuration pour différencier les tests
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/testSetup.js']
    },
    {
      displayName: 'integration-mock',
      testMatch: ['<rootDir>/tests/integration/routes/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/testSetup.js']
    },
    {
      displayName: 'integration-real',
      testMatch: ['<rootDir>/tests/integration/**/*.integration.test.js'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/realIntegrationSetup.js']
    }
  ]
};