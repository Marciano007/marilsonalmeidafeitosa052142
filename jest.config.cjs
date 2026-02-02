module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(?:@angular|rxjs)/)'
  ],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      packageJson: '<rootDir>/package.json'
    }
  }
  ,
  moduleNameMapper: {
    '^@angular/core(.*)$': '<rootDir>/test-stubs/angular-core.ts',
    '^@angular/router(.*)$': '<rootDir>/test-stubs/angular-router.ts'
  }
};
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  }
};
