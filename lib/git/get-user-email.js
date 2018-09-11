/**
 * @since 20180911 16:37
 * @author vivaxy
 */

const getInfoFromShell = require('../get-info-from-shell.js');

module.exports = async() => {
  return await getInfoFromShell('git', ['config', '--get', 'user.email']);
};
