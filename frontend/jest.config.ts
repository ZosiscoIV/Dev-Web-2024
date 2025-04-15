// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript'
      ],
    }],
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageProvider: "v8",
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library)/)'
  ]
};

export default config;