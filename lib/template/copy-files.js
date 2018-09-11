/**
 * @since 20180911 16:47
 * @author vivaxy
 */

const path = require('path');
const glob = require('fast-glob');
const fse = require('fs-extra');

module.exports = async ({ templateDir }) => {
  const files = await glob(['**/*', '!**/*.ejs'], {
    cwd: templateDir,
    dot: true,
  });
  await Promise.all(
    files.map((file) => {
      const task = async () => {
        await fse.copy(
          path.join(templateDir, file),
          path.join(process.cwd(), file)
        );
      };
      return task();
    })
  );
};
