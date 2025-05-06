// jest.config.ts
import type { Config } from 'jest';
/*
module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["/node_modules/", ".*\\.test\\.skip\\.jsx?$"],
};
*/

const config: Config = {
  //preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1', 
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

  },
  transform: {
    //'^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    //"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { configFile: "./test/babel.config.js" }],

  },  
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'], // pour matcher les .test.tsx
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageProvider: "v8",
  
};

export default config;
