/**
 * @since 20180911 16:54
 * @author vivaxy
 */
import path from 'path';
import glob from 'fast-glob';
import fse from 'fs-extra';
import ejs from 'ejs';
import { getFileName } from './get-file-name.js';

export async function createFiles({ srcDir, distDir, params }) {
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
}
