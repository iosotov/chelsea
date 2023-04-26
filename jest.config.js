module.exports = {
  testEnvironment: 'node',

  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '\\.(scss|sass|css)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel', '@babel/preset-typescript'] }]
  },
  globalSetup: './global-setup.js',
  globalTeardown: './global-teardown.js'
}
