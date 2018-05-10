/**
 * @since 2016-11-28 20:56
 * @author vivaxy
 */

const getInfoFromShell = require('../getInfoFromShell.js');

module.exports = async() => {
  return await getInfoFromShell('git', ['remote']);
};
