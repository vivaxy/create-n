#!/usr/bin/env node

/**
 * @since 20180510 14:02
 * @author vivaxy
 */

const path = require('path');
const execa = require('execa');
const fse = require('fs-extra');
const prompts = require('prompts');
const getRemoteURL = require('./lib/git/getRemoteURL.js');

const create = async() => {

  const files = await fse.readdir(process.cwd());
  if (files.length !== 0) {
    const { override } = await prompts([
      {
        type: 'confirm',
        name: 'override',
        message: 'Directory not empty, override?',
        initial: true,
      }
    ], {
      onCancel: () => {
        console.log('Create cancelled.');
        process.exit(1);
      }
    });
    if (!override) {
      console.log('Create cancelled.');
      process.exit(0);
    }
  }

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
    }
  });

  const gitRemoteURL = getRemoteURL(); //=> git@github.com:vivaxy/create-n.git
  const [_git, hostname_username_reponame_] = gitRemoteURL.split('@'); //=> github.com:vivaxy/create-n.git
  const [hostname_username_reponame, _] = hostname_username_reponame_.split('.git'); //=> github.com:vivaxy/create-n
  const [hostname, username_reponame] = hostname_username_reponame.split(':'); //=> github.com, vivaxy/create-n
  const [username, reponame] = username_reponame.split('/'); //=> vivaxy, create-n

  await fse.writeFile('package.json', JSON.stringify({
      name,
      version: '0.0.0',
      description: 'Create Npm Package',
      scripts: {
        release: 'standard-version && git push --follow-tags && npm publish --registry=https://registry.npmjs.org/'
      },
      repository: {
        type: 'git',
        url: `git+https://${hostname}/${username}/${reponame}.git`
      },
      author: username,
      license: 'MIT',
      bugs: {
        url: `https://${hostname}/${username}/${reponame}/issues`
      },
      homepage: `https://${hostname}/${username}/${reponame}#readme`,
    }
  ));

  await fse.writeFile('.editorconfig', 'root = true\n' +
    '\n' +
    '[*]\n' +
    'indent_style = space\n' +
    'indent_size = 2\n' +
    'end_of_line = lf\n' +
    'charset = utf-8\n' +
    'trim_trailing_whitespace = true\n' +
    'insert_final_newline = true\n' +
    'curly_bracket_next_line = false\n' +
    'spaces_around_operators = true\n' +
    'indent_brace_style = 1tbs\n' +
    '\n' +
    '[*.js]\n' +
    'quote_type = single\n' +
    '\n' +
    '[package.json]\n' +
    'indent_size = 2\n');

  await fse.writeFile('.gitignore', '.idea\n' +
    'node_modules\n' +
    '.DS_Store\n');

  await fse.writeFile('.npmrc', 'registry="https://registry.npmjs.org/"\n');

  await fse.writeFile('index.js', '#!/usr/bin/env node\n');

  await fse.writeFile('LICENSE', 'MIT License\n' +
    '\n' +
    'Copyright (c) 2018 vivaxy\n' +
    '\n' +
    'Permission is hereby granted, free of charge, to any person obtaining a copy\n' +
    'of this software and associated documentation files (the "Software"), to deal\n' +
    'in the Software without restriction, including without limitation the rights\n' +
    'to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' +
    'copies of the Software, and to permit persons to whom the Software is\n' +
    'furnished to do so, subject to the following conditions:\n' +
    '\n' +
    'The above copyright notice and this permission notice shall be included in all\n' +
    'copies or substantial portions of the Software.\n' +
    '\n' +
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' +
    'IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
    'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n' +
    'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' +
    'LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' +
    'OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n' +
    'SOFTWARE.\n');

  await fse.writeFile('README.md', `# ${reponame}\n`);

  await execa.shell('yarn add standard-version --dev');

  console.log('Create N success!');

};

create().catch((ex) => {
  console.log(ex);
});
