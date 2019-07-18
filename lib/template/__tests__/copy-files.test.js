/**
 * @since 20180911 16:47
 * @author vivaxy
 */

const path = require('path');
const fse = require('fs-extra');
const copyFile = require('../copy-files.js');

const projectBaseDir = path.join(__dirname, '..', '..', '..');
const templateDir = path.join(projectBaseDir, 'template');

test('copy .gitignore', async function() {
  const testDir = path.join(__dirname, 'test-copy-files');
  await fse.ensureDir(testDir);
  await copyFile({ srcDir: templateDir, distDir: testDir });
  const gitignoreFile = path.join(testDir, '.gitignore');
  const exists = await fse.pathExists(gitignoreFile);
  expect(exists).toBe(true);
  await fse.remove(testDir);
});

test('copy src/__tests__/index.js', async function() {
  const testDir = path.join(__dirname, 'test-copy-files');
  await fse.ensureDir(testDir);
  await copyFile({ srcDir: templateDir, distDir: testDir });
  const testFile = path.join(testDir, 'src/__tests__/index.test.ts');
  const exists = await fse.pathExists(testFile);
  expect(exists).toBe(true);
  await fse.remove(testDir);
});
