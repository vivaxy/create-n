/**
 * @since 2024-01-23
 * @author vivaxy
 */
export default {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/__tests__/**/*.ts'],
};
