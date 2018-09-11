/**
 * @since 20180911 16:54
 * @author vivaxy
 */

const glob = require('fast-glob');
const fse = require('fs-extra');
const ejs = require('ejs');

module.exports = async({ templateDir, params }) => {
  const files = await glob(['*.ejs'], { cwd: templateDir });
  await Promise.all(files.map((file) => {
    const task = async() => {
      const fileContent = await fse.readFile(path.join(templateDir, file), 'utf8');
      await fse.writeFile(path.join(process.cwd(), file), ejs.render(fileContent, params));
    };
    return task();
  }));
};
