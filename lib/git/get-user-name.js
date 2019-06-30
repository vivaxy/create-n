/**
 * @since 2019-06-25 15:41
 * @author vivaxy
 */

const getInfoFromShell = require('../get-info-from-shell.js');

module.exports = async () => {
  return await getInfoFromShell('git', ['config', '--get', 'user.name']);
};
