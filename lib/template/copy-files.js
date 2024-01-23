/**
 * @since 20180911 16:47
 * @author vivaxy
 */
import path from 'path';
import glob from 'fast-glob';
import fse from 'fs-extra';
import { getFileName } from './get-file-name.js';

export async function copyFiles({ srcDir, distDir, params }) {
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
}
