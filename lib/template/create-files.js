/**
 * @since 20180911 16:54
 * @author vivaxy
 */

const path = require('path');
const glob = require('fast-glob');
const fse = require('fs-extra');
const ejs = require('ejs');

module.exports = async ({ templateDir, params }) => {
  const files = await glob(['**/*.ejs'], { cwd: templateDir, dot: true });
  await Promise.all(
    files.map((file) => {
      const task = async () => {
        const fileContent = await fse.readFile(
          path.join(templateDir, file),
          'utf8'
        );
        await fse.writeFile(
          path.join(process.cwd(), path.basename(file, '.ejs')),
          ejs.render(fileContent, params)
        );
      };
      return task();
    })
  );
};
