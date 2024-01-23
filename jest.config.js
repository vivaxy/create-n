/**
 * @since 2024-01-23
 * @author vivaxy
 */
export default {
  collectCoverageFrom: ['lib/**/*.js', 'index.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/template/src',
    '/lib/template/__tests__/working-directories/',
    '/__tests__/fixtures/',
  ],
};
