export class Environment
{
  constructor(parent)
  {
    this.parent = parent;
    this.variables = {};
  }

  reset()
  {
    this.variables = {};
  }

  resolve(name)
  {
    if (this.has(name)) {
      return this.variables[name];
    }

    if (this.parent != undefined) {
      return this.parent.resolve(name);
    }

    throw new Error(`Variable '${name}' is not defined!`);
  }

  define(name, value)
  {
    if (this.has(name)) {
      throw new Error(`Variable '${name}' is already defined!`);
    }

    this.variables[name] = value;

    return value;
  }

  assign(name, value)
  {
    if (this.has(name)) {
      this.variables[name] = value;
    }

    throw new Error(`Variable '${name}' is not defined!`);
  }

  has(name) {
    return Object.hasOwn(this.variables, name);
  }

  lookup(name) {
    return this.resolve(name);
  }
}