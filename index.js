#!/usr/bin/env node

/**
 * @since 20180510 14:02
 * @author vivaxy
 */

const path = require('path');
const execa = require('execa');
const fse = require('fs-extra');
const prompts = require('prompts');
const getRemoteURL = require('./lib/git/get-remote-url.js');
const getUserEmail = require('./lib/git/get-user-email.js');
const copyFiles = require('./lib/template/copy-files.js');
const createFiles = require('./lib/template/create-files.js');

(async() => {
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
    const { override } = await prompts([
      {
        type: 'confirm',
        name: 'override',
        message: 'Directory not empty, override?',
        initial: true,
      },
    ], {
      onCancel: () => {
        console.log('Create cancelled.');
        process.exit(1);
      },
    });
    if (!override) {
      console.log('Create cancelled.');
      process.exit(0);
    }
  }
}

async function getParams() {
  const { name } = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'package name',
      initial: path.basename(process.cwd()),
    },
  ], {
    onCancel: () => {
      console.log('Create cancelled.');
      process.exit(1);
    },
  });

  const [gitRemoteURL, userEmail] = await Promise.all([getRemoteURL(), getUserEmail()]); // => git@github.com:vivaxy/create-n.git
  if (!gitRemoteURL) {
    console.log('Create failed with error git remote URL: ' + gitRemoteURL);
    process.exit(1);
  }
  const [_git, hostname_username_reponame_] = gitRemoteURL.split('@'); // => github.com:vivaxy/create-n.git
  const [hostname_username_reponame, _] = hostname_username_reponame_.split('.git'); // => github.com:vivaxy/create-n
  const [hostname, username_reponame] = hostname_username_reponame.split(':'); // => github.com, vivaxy/create-n
  const [username, reponame] = username_reponame.split('/'); // => vivaxy, create-n
  return {
    name,
    username,
    reponame,
    userEmail,
    hostname,
    year: new Date().getFullYear(),
  };
}

async function generateFiles(params) {
  const srcDir = path.join(__dirname, 'template');
  await Promise.all([copyFiles({ srcDir, distDir: process.cwd() }), createFiles({
    srcDir,
    distDir: process.cwd(),
    params,
  })]);
}

async function installDependencies() {
  await execa.shell('yarn add ava husky lint-staged nyc prettier standard-version --dev');
}
