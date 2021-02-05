/**
 * @since 20180911 16:47
 * @author vivaxy
 */
const path = require('path');
const glob = require('fast-glob');
const fse = require('fs-extra');
const getFileName = require('./get-file-name.js');

module.exports = async ({ srcDir, distDir, params }) => {
  const files = await glob(['**/*', '!**/*.ejs'], {
    cwd: srcDir,
    dot: true,
  });
  await Promise.all(
    files.map((fileNameWithMark) => {
      const fileName = getFileName(fileNameWithMark, params);
      if (fileName) {
        const task = async () => {
          await fse.copy(
            path.join(srcDir, fileNameWithMark),
            path.join(distDir, fileName),
          );
        };
        return task();
      }
    }),
  );
};
