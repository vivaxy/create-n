/**
 * @since 2017-03-31 13:54:02
 * @author vivaxy
 */

const getInfoFromShell = require('../getInfoFromShell.js');
const getGitRemote = require('./getRemote.js');

module.exports = async() => {
  const remote = await getGitRemote();
  if (remote) {
    return await getInfoFromShell('git', ['remote', 'get-url', remote]);
  }
  return undefined;
};
