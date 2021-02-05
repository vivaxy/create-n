/**
 * @since 20180911 16:47
 * @author vivaxy
 */
const path = require('path');
const fse = require('fs-extra');
const createFiles = require('../create-files.js');

const projectBaseDir = path.join(__dirname, '..', '..', '..');
const fixturesDir = path.join(__dirname, 'fixtures');

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
  license: 'mit',
};

async function testRunner(testName, params, runTest) {
  const templateDir = path.join(fixturesDir, testName);
  const testDir = path.join(__dirname, 'working-directories', testName);
  await fse.ensureDir(testDir);
  await createFiles({ srcDir: templateDir, distDir: testDir, params });
  await runTest({ testDir });
  await fse.remove(testDir);
}

test('create files 0, plain file should exists', async function () {
  await testRunner('create-files-0', params, async function ({ testDir }) {
    const testFile = path.join(testDir, 'index.test.ts');
    const exists = await fse.pathExists(testFile);
    expect(exists).toBe(true);
  });
});

test('create files 1, file with query should exists', async function () {
  await testRunner('create-files-1', params, async function ({ testDir }) {
    const testFile = path.join(testDir, 'index.test.ts');
    const exists = await fse.pathExists(testFile);
    expect(exists).toBe(true);
  });
});

test('create files 2, file with query should not exists when value not match', async function () {
  await testRunner('create-files-2', params, async function ({ testDir }) {
    const testFile = path.join(testDir, 'index.test.ts');
    const exists = await fse.pathExists(testFile);
    expect(exists).toBe(false);
  });
});
