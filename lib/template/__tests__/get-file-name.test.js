/**
 * @since 2021-02-05 21:18
 * @author vivaxy
 */
const getFileName = require('../get-file-name.js');

test('get plain file name', async function () {
  expect(getFileName('README.md')).toBe('README.md');
  expect(getFileName('___README.md')).toBe('___README.md');
});

test('get marked file name', async function () {
  expect(getFileName('____README.md')).toBe('README.md');
});

test('get file name with query', async function () {
  expect(getFileName('____q_key_value_README.md')).toBe(null);
  expect(getFileName('____q_key_value_README.md', { key: 'value' })).toBe(
    'README.md',
  );
});
