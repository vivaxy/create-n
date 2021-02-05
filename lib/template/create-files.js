/**
 * @since 20180911 16:54
 * @author vivaxy
 */
const path = require('path');
const glob = require('fast-glob');
const fse = require('fs-extra');
const ejs = require('ejs');
const getFileName = require('./get-file-name.js');

module.exports = async ({ srcDir, distDir, params }) => {
  const files = await glob(['**/*.ejs'], { cwd: srcDir, dot: true });
  await Promise.all(
    files.map((fileNameWithMark) => {
      const fileName = getFileName(fileNameWithMark, params);
      if (fileName) {
        const task = async () => {
          const fileContent = await fse.readFile(
            path.join(srcDir, fileNameWithMark),
            'utf8',
          );
          await fse.outputFile(
            path.join(
              distDir,
              path.dirname(fileName),
              path.basename(fileName, '.ejs'),
            ),
            ejs.render(fileContent, params),
          );
        };
        return task();
      }
    }),
  );
};
