#!/usr/bin/env node
/**
 * @since 20180510 14:02
 * @author vivaxy
 */
import url from 'url';
import path from 'path';
import execa from 'execa';
import fse from 'fs-extra';
import prompts from 'prompts';
import logSymbols from 'log-symbols';
import { createRequire } from 'module';
import gitUrlParse from 'git-url-parse';
import { getCurrentRemoteUrl, getUserName, getUserEmail } from '@vivaxy/git';
import { copyFiles } from './lib/template/copy-files.js';
import { createFiles } from './lib/template/create-files.js';

const require = createRequire(import.meta.url);
const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const pkg = require('./package.json');

function padLeft(value, length = 2, padding = '0') {
  if (typeof value !== 'string') {
    value = String(value);
  }
  while (value.length < length) {
    value = `${padding}${value}`;
  }
  return value;
}

(async () => {
  const cwd = process.cwd();
  logInfo();
  await checkDir({ cwd });
  const params = await getParams({ cwd });
  await generateFiles(params);
  const dependencies = [];
  const devDependencies = [
    // commit hook
    'husky',
    'lint-staged',
    // commit lint
    '@commitlint/cli',
    '@commitlint/config-conventional',
    // code style
    'prettier',
    // build
    'typescript',
    // test
    'jest',
    '@types/jest',
    'ts-jest',
    // changelog
    'standard-version',
  ];
  await installDependencies(dependencies, devDependencies);
  console.log('Create N success!');
  process.exit(0);
})().catch((ex) => {
  console.log(ex);
  process.exit(1);
});

function logInfo() {
  console.log('Create-n version: ' + pkg.version);
}

async function checkDir({ cwd }) {
  const files = await fse.readdir(cwd);
  if (files.length !== 0) {
    const { override } = await prompts(
      [
        {
          type: 'confirm',
          name: 'override',
          message: 'Directory not empty, override?',
          initial: true,
        },
      ],
      {
        onCancel: () => {
          console.log('Create cancelled.');
          process.exit(1);
        },
      },
    );
    if (!override) {
      console.log('Create cancelled.');
      process.exit(0);
    }
  }
}

async function getParams({ cwd }) {
  const { name, license } = await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message: 'Enter package name',
        initial: path.basename(process.cwd()),
      },
      {
        type: 'select',
        name: 'license',
        message: 'Select a license',
        choices: [
          {
            title: 'GNU GPLv3',
            value: 'gpl',
          },
          {
            title: 'MIT License',
            value: 'mit',
          },
        ],
      },
    ],
    {
      onCancel() {
        console.log('Create cancelled.');
        process.exit(1);
      },
    },
  );

  const [username, gitRemoteURL, userEmail] = await Promise.all([
    getUserName({ cwd }),
    getCurrentRemoteUrl({ cwd }), // => git@github.com:vivaxy/create-n.git
    getUserEmail({ cwd }),
  ]);
  if (!gitRemoteURL) {
    console.log('Create failed with error git remote URL: ' + gitRemoteURL);
    process.exit(1);
  }

  const {
    name: repoName,
    owner: repoOwner,
    source,
  } = gitUrlParse(gitRemoteURL);
  const nowDate = new Date();
  const year = nowDate.getFullYear();
  return {
    name,
    username,
    userEmail,
    repoOwner,
    repoName,
    gitRemoteURL,
    hostname: source,
    year,
    fileHeadersTime: `${year}-${padLeft(nowDate.getMonth() + 1)}-${padLeft(
      nowDate.getDate(),
    )} ${padLeft(nowDate.getHours())}:${padLeft(
      nowDate.getMinutes(),
    )}:${padLeft(nowDate.getSeconds())}`,
    license,
  };
}

async function generateFiles(params) {
  console.log(logSymbols.info, 'create files ...');
  const srcDir = path.join(dirname, 'template');
  await Promise.all([
    copyFiles({ srcDir, distDir: process.cwd(), params }),
    createFiles({
      srcDir,
      distDir: process.cwd(),
      params,
    }),
  ]);
}

async function installDependencies(dependencies, devDependencies) {
  console.log(logSymbols.info, 'npm install ...');
  if (dependencies.length) {
    await execa('npm', ['install', ...dependencies, '--save'], {
      stdio: 'inherit',
    });
  }
  if (devDependencies.length) {
    await execa('npm', ['install', ...devDependencies, '--save-dev'], {
      stdio: 'inherit',
    });
  }
}
