#!/usr/bin/env node

/**
 * @since 20180510 14:02
 * @author vivaxy
 */

const path = require('path');
const execa = require('execa');
const fse = require('fs-extra');
const prompts = require('prompts');
const logSymbols = require('log-symbols');
const gitUrlParse = require('git-url-parse');
const {
  getCurrentRemoteUrl,
  getUserName,
  getUserEmail,
} = require('@vivaxy/git');
const copyFiles = require('./lib/template/copy-files.js');
const createFiles = require('./lib/template/create-files.js');

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
  console.log('Create-n version: ' + require('./package.json').version);
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
  const { name } = await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message: 'package name',
        initial: path.basename(process.cwd()),
      },
    ],
    {
      onCancel: () => {
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

  const { name: repoName, owner: repoOwner, source } = gitUrlParse(
    gitRemoteURL,
  );
  return {
    name,
    username,
    userEmail,
    repoOwner,
    repoName,
    gitRemoteURL,
    hostname: source,
    year: new Date().getFullYear(),
  };
}

async function generateFiles(params) {
  console.log(logSymbols.info, 'create files ...');
  const srcDir = path.join(__dirname, 'template');
  await Promise.all([
    copyFiles({ srcDir, distDir: process.cwd() }),
    createFiles({
      srcDir,
      distDir: process.cwd(),
      params,
    }),
  ]);
}

async function installDependencies(dependencies, devDependencies) {
  console.log(logSymbols.info, 'yarn install ...');
  if (dependencies.length) {
    await execa('yarn', ['add', ...dependencies], { stdio: 'inherit' });
  }
  if (devDependencies.length) {
    await execa('yarn', ['add', ...devDependencies, '--dev'], {
      stdio: 'inherit',
    });
  }
}
