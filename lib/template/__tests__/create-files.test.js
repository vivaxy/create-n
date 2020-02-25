/**
 * @since 20180911 16:47
 * @author vivaxy
 */
const path = require('path');
const fse = require('fs-extra');
const createFiles = require('../create-files.js');

const projectBaseDir = path.join(__dirname, '..', '..', '..');
const templateDir = path.join(projectBaseDir, 'template');

const params = {
  name: 'name',
  username: 'username',
  userEmail: 'userEmail',
  repoOwner: 'repoOnwer',
  repoName: 'repoName',
  gitRemoteURL: 'gitRemoteURL',
  hostname: 'hostname',
  year: 'year',
  fileHeadersTime: 'fileHeadersTime',
};

test('create src/__tests__/index.test.ts', async function() {
  const testDir = path.join(__dirname, 'working-directories', 'create-files');
  await fse.ensureDir(testDir);
  await createFiles({ srcDir: templateDir, distDir: testDir, params });
  const testFile = path.join(testDir, 'src/__tests__/index.test.ts');
  const exists = await fse.pathExists(testFile);
  expect(exists).toBe(true);
  await fse.remove(testDir);
});
