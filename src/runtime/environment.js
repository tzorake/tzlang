export class Environment
{
  constructor(parent)
  {
    this.parent = parent;
    this.variables = {};
    this.constants = [];
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

    throw new Error(`variable '${name}' is not defined!`);
  }

  define(name, value, constant = false)
  {
    if (this.has(name)) {
      throw new Error(`variable '${name}' is already defined!`);
    }

    this.variables[name] = value;
    if (constant) {
      this.constants.push(name);
    }

    return value;
  }

  assign(name, value)
  {
    if (this.constant(name)) {
      throw new Error(`variable '${name}' is a constant!`);
    }

    if (!this.has(name)) {
      throw new Error(`variable '${name}' is not defined!`);
    }

    this.variables[name] = value;
      
    return value;
  }

  has(name) {
    return Object.hasOwn(this.variables, name);
  }

  constant(name) {
    return this.constants.includes(name);
  }

  lookup(name) {
    return this.resolve(name);
  }
}