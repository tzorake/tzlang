export function isdigit(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[0-9]/) !== null;
}

export function isalpha(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[_a-zA-Z]/) !== null;
}

export function isalnum(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[_a-zA-Z0-9]/) !== null;
}

export function isbinary(char) 
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[01]/) !== null;
}

export function ishex(char) 
{
  if (char === undefined) {
    return false;
  }

  return char.match(/[0-9a-fA-F]/) !== null;
}

export function isstrterm(char)
{
  if (char === undefined) {
    return false;
  }

  return char.match(/["'`]/) !== null;
}

export function escape(string) 
{
  return string.replace(/\n/g, '\\n')
               .replace(/\t/g, '\\t');
}