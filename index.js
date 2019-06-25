#!/usr/bin/env node

/**
 * @since 20180510 14:02
 * @author vivaxy
 */

const path = require('path');
const execa = require('execa');
const fse = require('fs-extra');
const prompts = require('prompts');
const gitUrlParse = require('git-url-parse');
const getRemoteURL = require('./lib/git/get-remote-url.js');
const getUserName = require('./lib/git/get-user-name.js');
const getUserEmail = require('./lib/git/get-user-email.js');
const copyFiles = require('./lib/template/copy-files.js');
const createFiles = require('./lib/template/create-files.js');

(async () => {
  logInfo();
  await checkDir();
  const params = await getParams();
  await generateFiles(params);
  await installDependencies();
  console.log('Create N success!');
  process.exit(0);
})().catch((ex) => {
  console.log(ex);
  process.exit(1);
});

function logInfo() {
  console.log('Create-n version: ' + require('./package.json').version);
}

async function checkDir() {
  const files = await fse.readdir(process.cwd());
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
      }
    );
    if (!override) {
      console.log('Create cancelled.');
      process.exit(0);
    }
  }
}

async function getParams() {
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
    }
  );

  const [username, gitRemoteURL, userEmail] = await Promise.all([
    getUserName(),
    getRemoteURL(), // => git@github.com:vivaxy/create-n.git
    getUserEmail(),
  ]);
  if (!gitRemoteURL) {
    console.log('Create failed with error git remote URL: ' + gitRemoteURL);
    process.exit(1);
  }

  const { name: repoName, owner: repoOwner, source } = gitUrlParse(
    gitRemoteURL
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
  console.log('> create files ...');
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

async function installDependencies() {
  console.log('> yarn install ...');
  await execa.shell(
    'yarn add @commitlint/cli @commitlint/config-conventional ava husky lint-staged nyc prettier standard-version --dev'
  );
}
