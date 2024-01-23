/**
 * @since 2021-02-05 21:17
 * @author vivaxy
 */
const MARK = '____';
const QUERY_MARK = 'q_';
const QUERY_SEPERATOR = '_';

export function getFileName(fileNameWithMark, params = {}) {
  if (fileNameWithMark.startsWith(MARK)) {
    const fileNameWithQueryMark = fileNameWithMark.slice(MARK.length);
    if (fileNameWithQueryMark.startsWith(QUERY_MARK)) {
      // get file name with query
      const fileNameWithQuery = fileNameWithQueryMark.slice(QUERY_MARK.length);
      const [key, value, ...restName] =
        fileNameWithQuery.split(QUERY_SEPERATOR);
      if (params[key] === value) {
        return restName.join(QUERY_SEPERATOR);
      }
      return null;
    }
    return fileNameWithMark.slice(MARK.length);
  }
  return fileNameWithMark;
}
