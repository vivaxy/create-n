/**
 * @since 20180911 16:47
 * @author vivaxy
 */
const path = require('path');
const glob = require('fast-glob');
const fse = require('fs-extra');
const MARK = '____';
const QUERY_MARK = 'q_';
const QUERY_SEPERATOR = '_';

function extractFileName(fileNameWithMark, params) {
  if (fileNameWithMark.startsWith(MARK)) {
    const fileNameWithQueryMark = fileNameWithMark.slice(MARK.length);
    if (fileNameWithQueryMark.startsWith(QUERY_MARK)) {
      // get file name with query
      const fileNameWithQuery = fileNameWithQueryMark.slice(QUERY_MARK.length);
      const [key, value, ...restName] = fileNameWithQuery.split(
        QUERY_SEPERATOR,
      );
      if (params[key] === value) {
        return restName.join(QUERY_SEPERATOR);
      }
      return null;
    }
    return fileNameWithMark.slice(MARK.length);
  }
  return null;
}

module.exports = async ({ srcDir, distDir, params }) => {
  const files = await glob(['**/*', '!**/*.ejs'], {
    cwd: srcDir,
    dot: true,
  });
  await Promise.all(
    files.map((fileNameWithMark) => {
      const fileName = extractFileName(fileNameWithMark, params);
      if (fileName) {
        const task = async () => {
          const distFileName = fileNameWithMark.startsWith(MARK)
            ? fileNameWithMark.slice(MARK.length)
            : fileNameWithMark;
          await fse.copy(
            path.join(srcDir, fileNameWithMark),
            path.join(distDir, distFileName),
          );
        };
        return task();
      }
    }),
  );
};
