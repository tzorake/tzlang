/**
 * @param {string} char 
 * 
 * @returns {boolean}
 */
export function isdigit(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[0-9]/) !== null;
}

/**
 * @param {string} char 
 * 
 * @returns {boolean}
 */
export function isalpha(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[_a-zA-Z]/) !== null;
}

/**
 * @param {string} char 
 * 
 * @returns {boolean}
 */
export function isalnum(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[_a-zA-Z0-9]/) !== null;
}

/**
 * @param {string} char 
 * 
 * @returns {boolean}
 */
export function isbinary(char) 
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[01]/) !== null;
}

/**
 * @param {string} char 
 * 
 * @returns {boolean}
 */
export function ishex(char) 
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[0-9a-fA-F]/) !== null;
}

/**
 * @param {string} char 
 * 
 * @returns {boolean}
 */
export function isstrterm(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/["'`]/) !== null;
}

/**
 * @param {string} string 
 * 
 * @returns {string}
 */
export function escape(string) 
{
  return string.replace(/\n/g, '\\n')
               .replace(/\t/g, '\\t');
}