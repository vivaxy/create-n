/**
 * @since 20180911 16:47
 * @author vivaxy
 */

const path = require('path');
const test = require('ava');
const fse = require('fs-extra');
const copyFile = require('../copy-files.js');

const projectBaseDir = path.join(__dirname, '..', '..', '..');
const templateDir = path.join(projectBaseDir, 'template');

test('copy .gitignore', async (t) => {
  const testDir = path.join(__dirname, 'test-copy-files');
  await fse.ensureDir(testDir);
  await copyFile({ srcDir: templateDir, distDir: testDir });
  const gitignoreFile = path.join(testDir, '.gitignore');
  const exists = await fse.pathExists(gitignoreFile);
  t.true(exists);
  await fse.remove(testDir);
});

test('copy __tests__/index.js', async (t) => {
  const testDir = path.join(__dirname, 'test-copy-files');
  await fse.ensureDir(testDir);
  await copyFile({ srcDir: templateDir, distDir: testDir });
  const testFile = path.join(testDir, '__tests__/index.js');
  const exists = await fse.pathExists(testFile);
  t.true(exists);
  await fse.remove(testDir);
});
