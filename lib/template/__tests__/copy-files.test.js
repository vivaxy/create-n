/**
 * @since 20180911 16:47
 * @author vivaxy
 */
import url from 'url';
import path from 'path';
import fse from 'fs-extra';
import { copyFiles } from '../copy-files.js';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectBaseDir = path.join(dirname, '..', '..', '..');
const templateDir = path.join(projectBaseDir, 'template');

test('copy .gitignore', async function () {
  const testDir = path.join(dirname, 'working-directories', 'copy-files');
  await fse.ensureDir(testDir);
  await copyFiles({ srcDir: templateDir, distDir: testDir });
  const gitignoreFile = path.join(testDir, '.gitignore');
  const exists = await fse.pathExists(gitignoreFile);
  expect(exists).toBe(true);
  await fse.remove(testDir);
});
