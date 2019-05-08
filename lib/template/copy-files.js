/**
 * @since 20180911 16:47
 * @author vivaxy
 */

const path = require('path');
const glob = require('fast-glob');
const fse = require('fs-extra');
const markString = '____';

module.exports = async ({ srcDir, distDir }) => {
  const files = await glob(['**/*', '!**/*.ejs'], {
    cwd: srcDir,
    dot: true,
  });
  await Promise.all(
    files.map((file) => {
      const task = async () => {
        const distFileName = file.startsWith(markString)
          ? file.slice(markString.length)
          : file;
        await fse.copy(
          path.join(srcDir, file),
          path.join(distDir, distFileName)
        );
      };
      return task();
    })
  );
};
